import { NostrEvent } from "../../shared/types.ts";
import { async, nostr } from "../deps.ts";
import { awaitForEachWithDelay } from "./async.ts";
import { getRandomKinds } from "./getRandomKinds.ts";
import { getRandomRelay } from "./getRandomRelay.ts";
import { getRandomRelays } from "./getRandomRelays.ts";
import { DefaultOptionsWithLogger } from "./options.ts";
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

      logger.debug("#lMer4G Subscribing for kinds", relayUrl, kinds.join(", "));

      if (events.length > 0) {
        const event = events[0] as NostrEvent;
        saveFoundKind({ options, event, relayUrl });
      }
    },
    options.relays.delay * 1e3
  );
};

const crawlRelayUrl = async (
  options: DefaultOptionsWithLogger,
  relayUrl: string
) => {
  const { logger } = options;
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
};

export const crawl = async (options: DefaultOptionsWithLogger) => {
  const { logger } = options;
  const relayUrls = await getRandomRelays(options, options.relays.inParallel);
  logger.debug("#d0T3uX Got relayUrls", relayUrls);

  await Promise.allSettled(
    relayUrls.map((relayUrl) => crawlRelayUrl(options, relayUrl))
  );
};

const recursivelyStartCrawler = async (
  options: DefaultOptionsWithLogger
): Promise<void> => {
  const { logger } = options;

  const delayInMilliseconds = options.relays.delay * 1_000;
  // Set a timeout of triple the delay time + 20 seconds, multiplied by the
  // number of subscriptions. So each subscription can take 3 x delay + 20s.
  // It's a pretty generous timeout.
  // TODO - Add a config option to set the delay
  const deadlinePerRelay =
    options.relays.subscriptions * 3 * (delayInMilliseconds + 20_000);
  logger.debug(
    "#Nm677a Starting with deadline per relay (ms)",
    deadlinePerRelay
  );

  while (true) {
    try {
      const relayUrl = await getRandomRelay(options);

      try {
        await async.deadline(
          crawlRelayUrl(options, relayUrl),
          deadlinePerRelay
        );
      } catch (error) {
        if (error instanceof async.DeadlineError) {
          logger.warning("#3YWiRM Crawling timed out", relayUrl);
        } else {
          throw error;
        }
      }
      logger.info("#cVsl11 Finished crawling relay", relayUrl);
    } catch (error) {
      logger.error("#H8JbJg Error during crawl", error);
    } finally {
      await async.delay(3_000);
    }
  }
};

export const start = async (options: DefaultOptionsWithLogger) => {
  const {
    logger,
    relays: { inParallel },
  } = options;
  logger.info("#2eYlBE Starting crawler");

  await Promise.allSettled(
    Array.from({ length: inParallel }).map(() =>
      recursivelyStartCrawler(options)
    )
  );
};
