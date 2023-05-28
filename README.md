# Wine Scraper

A web scraper designed to pull prices from various Irish SuperMarkets and notify me of the latest prices daily

## How its Made
Tech used: Typescript, Drizzle ORM, SQLite, zod, cheerio

I built this to learn Drizzle ORM, and to run using a cron job on my raspberry pi. Prisma would not work as I have a 3B+ and their rust binaries  do not compile for this arm CPU. I looked into self compiling but this gave me an excuse to try Drizzle ORM, with works in just Typescript. I added Pushover to use it to notify me, and zod for data validation.

I wrote webscrapers in cheerio for each of the supermarkets. I then validate in zod and add this price to an SQLite DB. In previous versions this app would compare if the price had changed before notifying me.

I also used this app as a way to learn to use vitest. I tried to use jest but vitest offers a much better dev experience when setting up testing with ESM

I also used and configured ESBuild, I figured since this is running on the Pi it would be best to not add the overhead of using ts node or tsx.

## Optimizations/TODOs
 - [ ] reimplement the change tracking and only push if there is a change

## Lessons Learned:

How to read docs for an earlier pre-1.0 library (with little documentation). And how to use their Discord/Support forums to find assistance (usually without asking directly but searching in the help channels).
