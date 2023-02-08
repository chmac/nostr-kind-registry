import { NostrEvent } from "../../shared/types.ts";
import { nostr } from "../deps.ts";
import { awaitForEachWithDelay } from "./async.ts";
import { getRandomKinds } from "./getRandomKinds.ts";
import { getRelays } from "./getRelays.ts";
import { saveFoundKind } from "./saveFoundKind.ts";

const logFactory = (verbose?: boolean) => (verbose ? console.log : () => {});

type Options = {
  relays: {
    count: number;
    subscriptions: number;
    delay: number;
  };
  kinds: {
    perSubscription: number;
    maximum: number;
  };
  verbose?: boolean | undefined;
};

const crawlRelay = async ({
  client,
  options,
  log,
}: {
  client: nostr.Nostr;
  options: Options;
  log: ReturnType<typeof logFactory>;
}) => {
  await awaitForEachWithDelay(
    Array.from({ length: options.relays.subscriptions }),
    async () => {
      const kinds = await getRandomKinds(
        options.kinds.perSubscription,
        options.kinds.maximum
      );

      const events = await client
        .filter({
          kinds,
          limit: 1,
        })
        .collect();

      log("#lMer4G Subscribing for kinds", kinds.join(", "));

      if (events.length > 0) {
        const event = events[0] as NostrEvent;
        saveFoundKind({ event, relayUrl: "" });
      }
    },
    options.relays.delay * 1e3
  );
};

export const crawl = async (options: Options) => {
  const log = logFactory(options.verbose);

  const relayUrls = await getRelays(options.relays.count);
  log("#d0T3uX Got relayUrls", relayUrls);

  await Promise.allSettled(
    relayUrls.map(async (relayUrl) => {
      const client = new nostr.Nostr();
      client.privateKey = "";
      client.relayList.push({ name: relayUrl, url: relayUrl } as never);

      log("#LHc6qS Connecting to relay", relayUrl);
      try {
        await client.connect();
      } catch (error) {
        console.error("#x5P3fz Error trying to connect to relay");
        console.error(relayUrl);
        console.error(error);
        return;
      }

      crawlRelay({ client, options, log });

      client.disconnect();
    })
  );
};
