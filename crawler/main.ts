import { async, cliffy, nostr } from "./deps.ts";
import { getRandomKinds } from "./src/getRandomKinds.ts";
import { getRelays } from "./src/getRelays.ts";
/**
 * PLAN
 *
 * - [ ] Pick a deno client
 * - [ ] Get a list of target relays
 *   - Could update this dynamically into local state
 * - [ ] Pick a local state store (lowdb?)
 * - [ ] Write a crawler
 *
 * NEW PLAN
 *
 * - [ ] Pick 100 random unseen kinds
 * - [ ] Query a relay for those kinds
 * - [ ] Report any new findings
 * - [ ] Persist that report somewhere
 */

const awaitForEach = async <T>(
  input: T[],
  iterator: (element: T) => Promise<void>
) => {
  await input.reduce(async (last, currentValue) => {
    await last;
    await iterator(currentValue);
  }, Promise.resolve());
};

const logFactory = (verbose?: boolean) => (verbose ? console.log : () => {});

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
  .option("-v, --verbose", "Log every step in the process")
  .action(async (options) => {
    const log = logFactory(options.verbose);

    const relayUrls = await getRelays(options.relays.count);
    log("#d0T3uX Got relayUrls", relayUrls);

    const client = new nostr.Nostr();
    client.privateKey = "";

    relayUrls.forEach((relayUrl) => {
      client.relayList.push({ name: relayUrl, url: relayUrl } as never);
    });

    log("#vYzqmj Connecting to relay(s)");
    await client.connect();
    log("#Fa2TCY Connected to relay(s)");

    await awaitForEach(
      Array.from({ length: options.relays.subscriptions }),
      async () => {
        const kinds = await getRandomKinds(options.kinds.perSubscription);
        log("#lMer4G Subscribing for kinds", kinds);
        const result = await client
          .filter({
            kinds,
            limit: 1,
          })
          .collect();

        if (result.length > 0) {
          console.log("#6jdpMg Found an event!!!", result);
        }

        log("#NuKbhv Waiting for delay seconds");
        await async.delay(options.relays.delay * 1e3);
        log("#NzoTHe Finished waiting");
      }
    );
  })
  .parse();
