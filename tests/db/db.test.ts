import { describe, it, expect, vi, beforeEach } from "vitest";
import { getItemsAndLast2Prices } from "../../src/db/db.js";

describe("DB test runner", () => {
  it("Selects the needful", () => {
    console.log(getItemsAndLast2Prices());
  });
});
