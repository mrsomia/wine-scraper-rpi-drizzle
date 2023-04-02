import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const items = sqliteTable("items", {
  id: integer("id").primaryKey(),
  name: text("name").notNull(),
});

export const links = sqliteTable("links", {
  id: integer("id").primaryKey(),
  storeName: text("store_name").notNull(),
  link: text("link", { enum: ["tesco", "dunnes", "supervalu"] }).notNull(),
  itemId: integer("item_id").references(() => items.id),
});

export const prices = sqliteTable("prices", {
  id: integer("id").primaryKey(),
  price: integer("price").notNull(),
  storeName: text("store_name").references(() => links.storeName),
  date: integer("date", { mode: "timestamp" }),
  itemId: integer("item_id"),
});