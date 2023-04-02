import { drizzle } from "drizzle-orm/better-sqlite3";

//@ts-expect-error
import Database from "better-sqlite3";
import { items } from "./schema";

const sqlite = new Database("prices.db");
export const db = drizzle(sqlite);

const allItems = db.select().from(items).all();
