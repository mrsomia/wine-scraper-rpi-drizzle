import { drizzle } from "drizzle-orm/better-sqlite3/index.js";
import { eq, gte, desc } from "drizzle-orm/expressions.js";
//@ts-expect-error
import Database from "better-sqlite3";
import { items, links, prices } from "./schema.js";
import "dotenv/config";
import { InferModel } from "drizzle-orm";

const PATH_TO_DB = process.env.PATH_TO_DB;

const sqlite = new Database(PATH_TO_DB);
export const db = drizzle(sqlite);

export const getAllItems = () => db.select().from(items).all();

export function getAllItemsWithLinks() {
  const itemsAndLinks = db
    .select()
    .from(items)
    .leftJoin(links, eq(items.id, links.itemId))
    .all();

  return itemsAndLinks.map((itemAndLink) => {
    return {
      ...itemAndLink.items,
      url: itemAndLink.links,
    };
  });
}

export function addPrice({
  price,
  itemId,
  storeName,
}: {
  price: number;
  itemId: number;
  storeName: InferModel<typeof prices>["storeName"];
}) {
  return db
    .insert(prices)
    .values({ price, itemId, storeName, createdAt: new Date() })
    .returning()
    .all();
}

export type ItemAndLink = ReturnType<typeof getAllItemsWithLinks>[number];

export function getAllItemsWithLatestPrices() {
  return db.select().from(items).leftJoin(prices, eq(items.id, prices.itemId));
}
