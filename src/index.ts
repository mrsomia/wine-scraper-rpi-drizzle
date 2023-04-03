import { scrapePricesAndAddToDB } from "./lib/scrape-utils.js";
import { makeMessageArray, pingDetails } from "./lib/notification.js";

async function main() {
  await scrapePricesAndAddToDB();
  const messageArr = makeMessageArray();
  try {
    await pingDetails(messageArr);
  } catch (err) {
    console.error(err);
  }
}

main();
