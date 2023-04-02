import axios from "axios";
import * as cheerio from "cheerio";
import { z } from 'zod'
import { ItemAndLink, addPrice, getAllItemsWithLinks } from "../db/db.js";

export async function getHTML(url: string) {
  const { data } = await axios.get(url);
  return data;
}

function validatePrice(p: unknown): number {
  const validatedPrice = z.number().safeParse(p);
  return validatedPrice.success ? validatedPrice.data : -1;
}

export async function getTescoPrice(url: string) {
  try {
    const data = await getHTML(url);
    const $ = cheerio.load(data);
    const priceElement = $(".price-per-sellable-unit .value");
    const p = parseFloat(priceElement.text());
    const price = validatePrice(p);
    return price;
  } catch {
    return -1;
  }
}

export async function getDunnesPrice(url: string) {
  try {
    const data = await getHTML(url);
    const $ = cheerio.load(data);
    const priceElement = $("[itemprop=price]")[0].attribs.content;
    const p = parseFloat(priceElement.slice(1));
    const price = validatePrice(p);
    return price;
  } catch {
    return -1;
  }
}

export async function getSuperValuPrice(url: string) {
  try {
    const data = await getHTML(url);
    const $ = cheerio.load(data);
    const priceElement = $(".product-details-price-item");
    const p = parseFloat(priceElement.text().trim().slice(1));
    const price = validatePrice(p);
    return price;
  } catch {
    return -1;
  }
}

const scrapeFunctions = {
  tesco: getTescoPrice,
  dunnes: getDunnesPrice,
  supervalu: getSuperValuPrice,
};

async function getPrice(itemWithLink: ItemAndLink) {
  if (!itemWithLink.url) {
    console.error(`No URL found for ${itemWithLink.name}`);
    return;
  }
  const store = itemWithLink.url.storeName;
  const url = itemWithLink.url.link;
  const price = await scrapeFunctions[store](url);
  return { ...itemWithLink, price };
}

export async function scrapePricesAndAddToDB() {
  const itemsWithLinks = getAllItemsWithLinks();
  console.log(itemsWithLinks);
  /* return; */
  await Promise.all(
    itemsWithLinks.map(async (itemWithLink) => {
      const scrapedPrice = await getPrice(itemWithLink);
      if (scrapedPrice && scrapedPrice.url && scrapedPrice.price >= 0) {
        addPrice({
          price: scrapedPrice.price,
          itemId: scrapedPrice.id,
          storeName: scrapedPrice.url.storeName,
        });
      }
    })
  );
}
