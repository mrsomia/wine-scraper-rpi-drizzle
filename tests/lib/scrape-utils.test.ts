import {
  getDunnesPrice,
  getSuperValuPrice,
  getTescoPrice,
} from "../../src/lib/scrape-utils";
import { describe, it, expect } from "vitest";

describe("Fetches wine prices", () => {
  const TEST_URLS = {
    tesco: "https://www.tesco.ie/groceries/en-IE/products/299531340",
    dunnes:
      "https://www.dunnesstoresgrocery.com/sm/delivery/rsid/258/product/19-crimes-red-wine-750ml-100873366",
    supervalu: "https://shop.supervalu.ie/shopping/product/1531948000",
  };

  it("Gets the price from the Dunne's page", async () => {
    const price = await getDunnesPrice(TEST_URLS.dunnes);
    expect(typeof price).toBe("number");
    expect(price).toBeGreaterThan(8);
  });

  it("Gets the price from the tesco page", async () => {
    const price = await getTescoPrice(TEST_URLS.tesco);
    expect(typeof price).toBe("number");
    expect(price).toBeGreaterThan(8);
  });

  const expectedPrice = process.env.TESCO_OFFER_TEST_PRICE;
  it.runIf(expectedPrice)(
    "Gets the offer price from the tesco page",
    async () => {
      const price = await getTescoPrice(TEST_URLS.tesco);
      expect(typeof price).toBe("number");
      expect(price).toBe(Number(expectedPrice));
    },
    8000,
  );

  it("Gets the price from the supervalu page", async () => {
    const price = await getSuperValuPrice(TEST_URLS.supervalu);
    expect(typeof price).toBe("number");
    expect(price).toBeGreaterThan(8);
  });
});

describe("Fetches correct JD prices", () => {
  const TEST_URLS = {
    tesco: "https://www.tesco.ie/groceries/en-IE/products/255248604",
  };

  it("Get the price from the tesco page", async () => {
    const price = await getTescoPrice(TEST_URLS.tesco);
    console.log({ price });
    expect(typeof price).toBe("number");
    expect(price).toBeGreaterThan(20);
  });
});
