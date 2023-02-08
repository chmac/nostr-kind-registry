import { WORKER_URL } from "../shared/constants.ts";
import { cliffy } from "./deps.ts";
import { crawl } from "./src/crawl.ts";

const command = new cliffy.Command()
  .name("crawl")
  .description("Crawl nostr relays searching for new kinds")
  .version("0.1.0")
  .globalEnv("AUTH_KEY=<authKey:string>", "Set the authentication key", {
    required: true,
  })
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
  .command(
    "add-relay <relayUrl:string>",
    "Add a relay to the list of stored relays"
  )
  .action(async (options, relayUrl) => {
    const result = await fetch(WORKER_URL, {
      body: JSON.stringify({ url: relayUrl }),
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: options.authKey,
      },
    });

    if (result.status !== 201) {
      const message = "#B3WYru Error saving relay";
      console.error(message, result.status);
      console.error(await result.text());
      throw new Error(message);
    }
  });

try {
  await command.parse();
} catch (error) {
  console.error("#UVxW6D Exiting with error now");
  console.error(error);
  Deno.exit(1);
}
