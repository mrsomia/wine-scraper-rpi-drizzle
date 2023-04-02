import { drizzle } from "drizzle-orm/better-sqlite3";
import { eq } from "drizzle-orm/expressions";
//@ts-expect-error
import Database from "better-sqlite3";
import { items, prices, links } from "./schema";
import "dotenv/config";

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
  storeName: string;
}) {
  db.insert(prices).values({ price, itemId, storeName });
}

export type ItemAndLink = ReturnType<typeof getAllItemsWithLinks>[number];