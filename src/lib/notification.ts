import "dotenv/config";
import { getAllItemsWithLatestPrices, getItemsAndLast2Prices } from "../db/db.js";
import type { InferModel } from "drizzle-orm";
import type { prices } from "../db/schema.js";

export const PUSHOVER_URL = "https://api.pushover.net/1/messages.json";

export function createMessageString(
  toPing: ReturnType<typeof makeMessageArray>
) {
  if (!toPing.length) return;
  let message = "";
  for (let item of toPing) {
    message += `The lowest price of ${item.name} in ${
      item.storeName
    } is €${item.price?.toFixed(2)}\n`;
  }
  return message;
}

export async function sendMessage(message: string) {
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

export async function pingDetails(toPing: ReturnType<typeof makeMessageArray>) {
  const message = createMessageString(toPing);
  if (!message) {
    console.error("No message to send message arrary provided");
    console.error({ messageArr: toPing });
    return;
  }
  console.log(`Sending the following message to pushover: \n${message}`);
  sendMessage(message);
}

export function makeMessageArray() {
  const items = getItemsAndLast2Prices();
  const groupedItems: Record<string, typeof items>= {}
  for (const item of items) {
    if (item.id in groupedItems) {
      groupedItems[item.id].push(item)
    } else {
      groupedItems[item.id] = [item]
    }
  }

  const toPing = Object.values(groupedItems).map((group) => {
    return group.reduce((p,v) => {
      return (p.price1 ?? 0) < (v.price1 ?? 0) ? p : v
    })
  }).map(item => {
      return {
        id: item.id,
        name: item.name,
        createdAt: item.createdAt1,
        storeName: item.storeName1,
        price: item.price1
      }
  });

  return toPing;
}
