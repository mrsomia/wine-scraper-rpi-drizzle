import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  formatItems,
  makeMessageArray,
  createMessageString,
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
    ],
  },
  {
    id: 1,
    name: "19 crimes",
    prices: [
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
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("finds the min price of the item", () => {
    const messageArr = makeMessageArray();
    expect(messageArr).toStrictEqual([
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

  it("consolidates prices to a single item", () => {
    const cleanItems = formatItems(items);
    expect(cleanItems).toStrictEqual([
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
    ]);
  });

  it("Calls fetch with expected input", () => {
    const message = createMessageString(makeMessageArray());
    expect(message).toBe(
      `The lowest price of 19 crimes in supervalu is €9.00\n`
    );
  });
});
