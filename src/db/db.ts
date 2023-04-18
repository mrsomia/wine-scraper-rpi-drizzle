import { drizzle } from "drizzle-orm/better-sqlite3/index.js";
import { eq, and, desc } from "drizzle-orm/expressions.js";
//@ts-expect-error
import Database from "better-sqlite3";
import { items, links, prices } from "./schema.js";
import "dotenv/config";
import { InferModel, sql } from "drizzle-orm";

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
      .orderBy(desc(prices.createdAt))
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

export function getItemsAndLast2Prices() {
  const sq = (sqname: string) =>
    db
      .select({
        itemId: prices.itemId,
        storeName: prices.storeName,
        price: prices.price,
        createdAt: prices.createdAt,
        rn: sql<number>`ROW_NUMBER() OVER (
          PARTITION BY ${prices.itemId}, ${prices.storeName} ORDER BY ${prices.createdAt} DESC
          )`.as(`${sqname}.rn`),
      })
      .from(prices);
  const p1 = db.$with("p1").as(sq("p1"));
  const p2 = db.$with("p2").as(sq("p2"));
  return db
    .with(p1, p2)
    .select({
      id: items.id,
      name: items.name,
      storeName1: p1.storeName,
      createdAt1: p1.createdAt,
      price1: p1.price,
      storeName2: p2.storeName,
      createdAt2: p2.createdAt,
      price2: p2.price,
    })
    .from(items)
    .leftJoin(p1, and(eq(items.id, p1.itemId), eq(p1.rn, 1)))
    .leftJoin(
      p2,
      and(eq(items.id, p2.itemId), eq(p1.storeName, p2.storeName), eq(p2.rn, 2))
    )
    .all();
}
