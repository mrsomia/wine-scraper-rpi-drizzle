import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core/index.js";

export const items = sqliteTable("items", {
  id: integer("id").primaryKey(),
  name: text("name").notNull(),
});

export const links = sqliteTable("links", {
  id: integer("id").primaryKey(),
  storeName: text("store_name", {
    enum: ["tesco", "dunnes", "supervalu"],
  }).notNull(),
  link: text("link").notNull(),
  itemId: integer("item_id")
    .references(() => items.id)
    .notNull(),
});

export const prices = sqliteTable("prices", {
  id: integer("id").primaryKey(),
  price: integer("price").notNull(),
  storeName: text("store_name", {
    enum: ["tesco", "dunnes", "supervalu"],
  }).notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  itemId: integer("item_id")
    .references(() => items.id)
    .notNull(),
});
