import { drizzle } from "drizzle-orm/better-sqlite3/index.js";
import { eq } from "drizzle-orm/expressions.js";
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
    .innerJoin(links, eq(items.id, links.itemId))
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
  /*
   * This may have worked another way
   * SELECT items.id, items.name, prices."store_name", prices."price", prices."date" FROM items INNER JOIN prices ON items.id = prices."item_id" WHERE prices.date < 1680393981863 ORDER BY items.name DESC, prices.date DESC;
   */
  const itemsAndLinks = getAllItemsWithLinks();

  const itemsAndPrices = itemsAndLinks.map((item) => {
    const recordedPrices = db
      .select()
      .from(prices)
      .where(eq(prices.storeName, item.url.storeName))
      .orderBy(prices.createdAt)
      .limit(2)
      .all();

    return {
      id: item.id,
      name: item.name,
      prices: recordedPrices,
    };
  });

  return itemsAndPrices;
}
