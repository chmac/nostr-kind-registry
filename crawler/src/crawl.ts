import { NostrEvent } from "../../shared/types.ts";
import { nostr } from "../deps.ts";
import { DefaultOptionsWithLogger } from "./options.ts";
import { awaitForEachWithDelay } from "./async.ts";
import { getRandomKinds } from "./getRandomKinds.ts";
import { getRandomRelays } from "./getRandomRelays.ts";
import { saveFoundKind } from "./saveFoundKind.ts";

const crawlRelay = async ({
  client,
  options,
  relayUrl,
}: {
  client: nostr.Nostr;
  options: DefaultOptionsWithLogger;
  relayUrl: string;
}) => {
  const { logger } = options;
  await awaitForEachWithDelay(
    Array.from({ length: options.relays.subscriptions }),
    async () => {
      const kinds = await getRandomKinds(options);

      const events = await client
        .filter({
          kinds,
          limit: 1,
        })
        .collect();

      logger.debug("#lMer4G Subscribing for kinds", kinds.join(", "));

      if (events.length > 0) {
        const event = events[0] as NostrEvent;
        saveFoundKind({ options, event, relayUrl });
      }
    },
    options.relays.delay * 1e3
  );
};

export const crawl = async (options: DefaultOptionsWithLogger) => {
  const { logger } = options;
  const relayUrls = await getRandomRelays(options);
  logger.debug("#d0T3uX Got relayUrls", relayUrls);

  await Promise.allSettled(
    relayUrls.map(async (relayUrl) => {
      try {
        logger.info("#GmECia Connecting to relay", relayUrl);
        const client = new nostr.Nostr();
        client.relayList.push({ name: relayUrl, url: relayUrl } as never);

        logger.debug("#LHc6qS Connecting to relay", relayUrl);
        try {
          await client.connect();
        } catch (error) {
          console.error("#x5P3fz Error trying to connect to relay");
          console.error(relayUrl);
          console.error(error);
          return;
        }

        await crawlRelay({ client, options, relayUrl });

        client.disconnect();
      } catch (error) {
        console.error("#vqGTj6 Error on relay", relayUrl);
        console.error(error);
      }
    })
  );
};
