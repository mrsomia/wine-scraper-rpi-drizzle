import "dotenv/config";
import { getAllItemsWithLatestPrices } from "../db/db.js";
import type { InferModel } from "drizzle-orm";
import type { prices } from "../db/schema.js";

export const PUSHOVER_URL = "https://api.pushover.net/1/messages.json";

export async function pingDetails(toPing: ReturnType<typeof makeMessageArray>) {
  if (!toPing.length) return;
  let message: string = "";
  for (let item of toPing) {
    message += `The lowest price of ${item.name} in ${
      item.minPrice.storeName
    } is €${item.minPrice.price.toFixed(2)}\n`;
  }
  console.log(`Sending the following message to pushover: \n${message}`);

  await fetch(PUSHOVER_URL, {
    method: "post",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify({
      token: process.env.PUSHOVER_APP_KEY,
      user: process.env.PUSHOVER_USER_KEY,
      message,
    }),
  });
}

export function makeMessageArray() {
  const items = getAllItemsWithLatestPrices();
  const cleanItems = formatItems(items);
  const toPing = cleanItems.map((item) => {
    const minPrice = item.prices.reduce((a, v) => {
      return v.price < a.price ? v : a;
    });
    return { id: item.id, name: item.name, minPrice };
  });

  return toPing;
}

export function formatItems(
  items: ReturnType<typeof getAllItemsWithLatestPrices>
) {
  type Result = {
    id: number;
    name: string;
    prices: InferModel<typeof prices>[];
  };
  const result: Record<string, Result> = {};
  for (const item of items) {
    const name = item.name;
    if (!(name in result)) {
      result[name] = {
        id: item.id,
        name: item.name,
        prices: [],
      };
    }

    const price = item.prices.at(-1);
    if (!price) continue;
    result[name].prices.push(price);
  }

  return Object.values(result);
}
