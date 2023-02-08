import { KindMeta, NostrEvent } from "../shared/types.ts";
import { WORKER_URL } from "./constants.ts";
import { cliffy, nostr } from "./deps.ts";
import { awaitForEachWithDelay } from "./src/async.ts";
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
  .option(
    "-k.m --kinds.maximum <maximum:integer>",
    "The highest kind to check",
    { default: 40e3 }
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

    await awaitForEachWithDelay(
      Array.from({ length: options.relays.subscriptions }),
      async () => {
        const kinds = await getRandomKinds(
          options.kinds.perSubscription,
          options.kinds.maximum
        );
        log("#lMer4G Subscribing for kinds", kinds);
        const results = await client
          .filter({
            kinds,
            limit: 1,
          })
          .collect();

        if (results.length > 0) {
          const event = results[0] as NostrEvent;
          const { kind } = event;
          const foundNewKind: KindMeta = {
            kind,
            seen: true,
            firstSeenTimestamp: Math.floor(Date.now() / 1e3),
          };
          try {
            await fetch(`${WORKER_URL}/${kind}`, {
              body: JSON.stringify(foundNewKind),
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
              },
            });
          } catch (error) {
            console.error("#HDufs6 Failed to PUT new kind", error);
            return;
          }
          console.log("#9s6XYY Found and saved new kind!!!", event);
        }
      },
      options.relays.delay * 1e3
    );

    client.disconnect();
  })
  .parse();
