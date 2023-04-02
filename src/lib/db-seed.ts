import type { InferModel } from "drizzle-orm";
import { db } from "../db/db";
import { items, prices, links } from "../db/schema";

const dbSeedData = {
  items: [
    {
      name: "19 Crimes, The Banished Dark Red Wine",
      URLs: {
        tesco: "https://www.tesco.ie/groceries/en-IE/products/299531363",
        dunnes:
          "https://www.dunnesstoresgrocery.com/sm/delivery/rsid/258/product/19-crimes-the-uprising-red-wine-750ml-100227693",
      },
    },
    {
      name: "19 Crimes, Red Wine",
      URLs: {
        tesco: "https://www.tesco.ie/groceries/en-IE/products/299531340",
        dunnes:
          "https://www.dunnesstoresgrocery.com/sm/delivery/rsid/258/product/19-crimes-red-wine-750ml-100873366",
        supervalu: "https://shop.supervalu.ie/shopping/product/1531948000",
      },
    },
    {
      name: "Jack Daniel's 70cl",
      URLs: {
        tesco: "https://www.tesco.ie/groceries/en-IE/products/255248604",
        dunnes:
          "https://www.dunnesstoresgrocery.com/sm/delivery/rsid/258/product/jack-daniels-tennessee-whiskey-70-cl-100672192",
        supervalu: "https://shop.supervalu.ie/shopping/product/1020340001",
      },
    },
  ],
};

type NewItem = InferModel<typeof items, "insert">;

const storeItems: NewItem[] = dbSeedData.items.map((item) => ({
  name: item.name,
}));

const dbItems = db.insert(items).values(storeItems).returning().all();

console.log("Entered into DB");
console.log(dbItems);

for (const item of dbItems) {
  const idx = dbSeedData.items.findIndex(
    (seedItem) => seedItem.name == item.name
  );
  if (idx < 0) {
    console.error(`Unable to find ${item.name} in dbSeedData`);
    continue;
  }
  const seedItem = dbSeedData.items[idx];
  for (const [key, value] of Object.entries(seedItem.URLs)) {
    const link = db
      .insert(links)
      .values({ storeName: key, link: value, itemId: item.id })
      .run();

    console.log(`Entered link for ${item.name}`);
    console.log(link);
  }
}
