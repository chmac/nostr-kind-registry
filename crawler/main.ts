import { cliffy } from "./deps.ts";
import { crawl } from "./src/crawl.ts";

await new cliffy.Command()
  .name("crawl")
  .description("Crawl nostr relays searching for new kinds")
  .version("0.1.0")
  .option(
    "-r.c, --relays.count <relayCount:integer>",
    "How many relays to crawl",
    {
      default: 1,
    }
  )
  .option(
    "-r.s, --relays.subscriptions <subscriptionCount:integer>",
    "How many subscriptions to make per relay",
    { default: 10 }
  )
  .option(
    "-r.d, --relays.delay <delaySeconds:integer>",
    "How long (in seconds) to wait between each subscription",
    { default: 5 }
  )
  .option(
    "-k.c, --kinds.perSubscription <kindsPerSubscription:integer>",
    "How many kinds to crawl per subscription",
    {
      default: 100,
    }
  )
  .option(
    "-k.m --kinds.maximum <maximum:integer>",
    "The highest kind to check",
    { default: 40e3 }
  )
  .option("-v, --verbose", "Log every step in the process")
  .action(crawl)
  .parse();
