import { db } from "./lib/db.js";
import { scrapePricesAndAddToDB } from "./lib/scrape-utils.js";
import { makeMessageArray, pingDetails } from "./lib/notification.js";

async function main() {
  await scrapePricesAndAddToDB(db);
  let messageArr = makeMessageArray(db);
  try {
    pingDetails(messageArr);
  } catch (err) {
    console.error(err);
  }
}

main();
