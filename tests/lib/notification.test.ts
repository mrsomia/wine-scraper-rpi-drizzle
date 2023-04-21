import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  makeMessageArray,
  createMessageString,
} from "../../src/lib/notification";
import { getItemsAndLast2Prices } from "../../src/db/db.js";

// This was taken from an actual result
const latestPrices: ReturnType<typeof getItemsAndLast2Prices> = [
  {
    id: 1,
    name: '19 Crimes, The Banished Dark Red Wine',
    storeName1: 'dunnes',
    createdAt1: new Date("2023-04-18T20:53:22.000"),
    price1: 10,
    storeName2: 'dunnes',
    createdAt2: new Date("2023-04-18T15:55:53.000Z"),
    price2: 10
  },
  {
    id: 1,
    name: '19 Crimes, The Banished Dark Red Wine',
    storeName1: 'tesco',
    createdAt1: new Date("2023-04-18T20:53:22.000Z"),
    price1: 12,
    storeName2: 'tesco',
    createdAt2: new Date("2023-04-18T15:55:53.000Z"),
    price2: 12
  },
  {
    id: 2,
    name: '19 Crimes, Red Wine',
    storeName1: 'dunnes',
    createdAt1: new Date("2023-04-18T20:53:21.000Z"),
    price1: 10,
    storeName2: 'dunnes',
    createdAt2: new Date("2023-04-18T15:55:54.000Z"),
    price2: 10
  },
  {
    id: 2,
    name: '19 Crimes, Red Wine',
    storeName1: 'supervalu',
    createdAt1: new Date("2023-04-18T20:53:22.000Z"),
    price1: 15.59,
    storeName2: 'supervalu',
    createdAt2: new Date("2023-04-18T15:55:52.000Z"),
    price2: 15.59
  },
  {
    id: 2,
    name: '19 Crimes, Red Wine',
    storeName1: 'tesco',
    createdAt1: new Date("2023-04-18T20:53:22.000Z"),
    price1: 11,
    storeName2: 'tesco',
    createdAt2: new Date("2023-04-18T15:55:53.000Z"),
    price2: 11
  },
  {
    id: 3,
    name: "Jack Daniel's 70cl",
    storeName1: 'dunnes',
    createdAt1: new Date("2023-04-18T20:53:22.000Z"),
    price1: 28,
    storeName2: 'dunnes',
    createdAt2: new Date("2023-04-18T15:55:53.000Z"),
    price2: 28
  },
  {
    id: 3,
    name: "Jack Daniel's 70cl",
    storeName1: 'supervalu',
    createdAt1: new Date("2023-04-18T20:53:22.000Z"),
    price1: 28,
    storeName2: 'supervalu',
    createdAt2: new Date("2023-04-18T15:55:53.000Z"),
    price2: 28
  },
  {
    id: 3,
    name: "Jack Daniel's 70cl",
    storeName1: 'tesco',
    createdAt1: new Date("2023-04-18T20:53:22.000Z"),
    price1: 28,
    storeName2: 'tesco',
    createdAt2: new Date("2023-04-18T15:55:54.000Z"),
    price2: 28
  }
]


const expectedMessageArr: ReturnType<typeof makeMessageArray> = [
      {
        id: 1,
        name: "19 Crimes, The Banished Dark Red Wine",
        storeName: 'dunnes',
        createdAt: new Date("2023-04-18T20:53:22.000"),
        price: 10,
      },
      {
        id: 2,
        name: "19 Crimes, Red Wine",
        storeName: 'dunnes',
        createdAt: new Date("2023-04-18T20:53:21.000Z"),
        price: 10,
      },
      {
        id: 3,
        name: "Jack Daniel's 70cl",
        storeName: 'tesco',
        createdAt: new Date("2023-04-18T20:53:22.000Z"),
        price: 28,
      },
    ]

vi.mock("../../src/db/db.js", () => {
  return {
    getItemsAndLast2Prices: () => latestPrices,
  };
});

describe("Notifications", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("finds the min price of the item", () => {
    const messageArr = makeMessageArray();
    expect(messageArr).toStrictEqual(expectedMessageArr);
  });

  it("Calls fetch with expected input", () => {
    const message = createMessageString(makeMessageArray());
    expect(message).toBe(
      "The lowest price of 19 Crimes, The Banished Dark Red Wine in dunnes is €10.00\nThe lowest price of 19 Crimes, Red Wine in dunnes is €10.00\nThe lowest price of Jack Daniel's 70cl in tesco is €28.00\n"
    );
  });
});
