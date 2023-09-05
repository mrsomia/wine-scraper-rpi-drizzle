import * as cheerio from "cheerio";
import { z } from "zod";
import { ItemAndLink, addPrice, getAllItemsWithLinks } from "../db/db.js";

export async function getHTML(url: string) {
  const data = await fetch(url).then((r) => r.text());
  return data;
}

function validatePrice(p: unknown): number {
  const price = z.number().parse(p);
  return price;
}

export async function getTescoPrice(url: string) {
  const data = await getHTML(url);
  const $ = cheerio.load(data);
  try {
    const priceElement = $("span.offer-text");
    const p = parseFloat(priceElement.text().split(" ")[0].slice(1));
    const price = validatePrice(p);
    return price;
  } catch {
    const priceElement = $("span.value");
    const p = parseFloat(priceElement.text());
    const price = validatePrice(p);
    return price;
  }
}

export async function getDunnesPrice(url: string) {
  const data = await getHTML(url);
  const $ = cheerio.load(data);
  const priceElement = $("meta[itemprop=price]")[0].attribs.content;
  const p = parseFloat(priceElement.slice(1));
  const price = validatePrice(p);
  return price;
}

export async function getSuperValuPrice(url: string) {
  const data = await getHTML(url);
  const $ = cheerio.load(data);
  const priceElement = $(".product-details-price-item");
  const p = parseFloat(priceElement.text().trim().slice(1));
  const price = validatePrice(p);
  return price;
}

const scrapeFunctions = {
  tesco: getTescoPrice,
  dunnes: getDunnesPrice,
  supervalu: getSuperValuPrice,
} as const;

async function getPrice(itemWithLink: ItemAndLink) {
  const store = itemWithLink.url.storeName;
  const url = itemWithLink.url.link;
  let price;
  try {
    price = await scrapeFunctions[store](url);
  } catch (e) {
    console.error(
      `Unable to fetch price for ${itemWithLink.name} in ${itemWithLink.url.storeName}}
      URL: ${itemWithLink.url.link}`,
    );
    return null;
  }
  return { ...itemWithLink, price };
}

function savePriceToDB(scrapedPrice: Awaited<ReturnType<typeof getPrice>>) {
  if (scrapedPrice && scrapedPrice.url && scrapedPrice.price >= 0) {
    const dbPrice = addPrice({
      price: scrapedPrice.price,
      itemId: scrapedPrice.id,
      storeName: scrapedPrice.url.storeName,
    });
    return dbPrice;
  }
  return null;
}

export async function scrapePricesAndAddToDB() {
  const itemsWithLinks = getAllItemsWithLinks();
  const savedPrices = await Promise.all(
    itemsWithLinks.map(async (itemWithLink) => {
      // Get price returns null if error
      const scrapedPrice = await getPrice(itemWithLink);
      if (!scrapedPrice) {
        return null;
      }

      let dbPrice;
      try {
        dbPrice = savePriceToDB(scrapedPrice);
      } catch (error) {
        console.error(
          `Unable to add prices to db for ${itemWithLink.name} in store: ${itemWithLink.url?.storeName}`,
        );
        console.error(error);
        console.error(scrapedPrice);
      }
      return dbPrice ?? null;
    }),
  );
  return savedPrices;
}
