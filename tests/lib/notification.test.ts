import { describe, it, expect, vi, afterEach } from "vitest";
import {
  makeMessageArray,
  pingDetails,
  PUSHOVER_URL,
} from "../../src/lib/notification";
import { getAllItemsWithLatestPrices } from "../../src/db/db.js";

const NOW = new Date();

const items: ReturnType<typeof getAllItemsWithLatestPrices> = [
  {
    id: 1,
    name: "19 crimes",
    prices: [
      {
        id: 9,
        storeName: "supervalu",
        price: 9,
        createdAt: NOW,
        itemId: 1,
      },
      {
        id: 11,
        storeName: "tesco",
        price: 10,
        createdAt: NOW,
        itemId: 1,
      },
    ],
  },
];

vi.mock("../../src/db/db.js", () => {
  return {
    getAllItemsWithLatestPrices: () => items,
  };
});


describe("Notifications", () => {
  it("finds the min price of the item", () => {
    expect(makeMessageArray()).toStrictEqual([
      {
        id: 1,
        name: "19 crimes",
        minPrice: {
          id: 9,
          storeName: "supervalu",
          price: 9,
          createdAt: NOW,
          itemId: 1,
        },
      },
    ]);
  });

  it("Calls fetch with expected input", () => {
    //TODO: Validate that it calls fetch with the message
    expect(true).toBe(true);
  });

  // TODO: format items - validates that with a given input it creates the same output
  it("formats items as expected", () => {
    expect(true).toBe(true);
  });
});
