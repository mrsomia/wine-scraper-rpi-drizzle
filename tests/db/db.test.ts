import { describe, it, expect, vi, beforeEach } from "vitest";
import { getItemsAndLast2Prices, getAllItemsWithLatestPrices } from "../../src/db/db.js";

describe("DB test runner", () => {
  it("Selects the needful", () => {
    console.log(getItemsAndLast2Prices());
  });
  
  it("gets the needful shape from the db", () => {
    console.log(JSON.stringify(getAllItemsWithLatestPrices(), null, 2))
  })
});
