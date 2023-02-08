import { WORKER_URL } from "../../shared/constants.ts";
import { KindMeta, NostrEvent } from "../../shared/types.ts";
import { nostr } from "../deps.ts";
import { awaitForEachWithDelay } from "./async.ts";
import { getRandomKinds } from "./getRandomKinds.ts";
import { getRelays } from "./getRelays.ts";

const logFactory = (verbose?: boolean) => (verbose ? console.log : () => {});

export const crawl = async (options: {
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
}) => {
  const log = logFactory(options.verbose);

  const relayUrls = await getRelays(options.relays.count);
  log("#d0T3uX Got relayUrls", relayUrls);

  const clients: nostr.Nostr[] = [];

  await Promise.all(
    relayUrls.map(async (relayUrl) => {
      log("setting up client for " + relayUrl);
      const client = new nostr.Nostr();
      client.privateKey = "";
      client.relayList.push({ name: relayUrl, url: relayUrl } as never);
      clients.push(client);
      await client.connect();
      log("client connected to " + relayUrl);
    })
  );

  async function subscribeClient(client: nostr.Nostr, kinds: number[]) {
    const events = await client
      .filter({
        kinds,
        limit: 1,
      })
      .collect();
    if (events.length > 0) {
      const event = events[0] as NostrEvent;
      const { kind } = event;
      const foundNewKind: KindMeta = {
        kind,
        seen: true,
        firstSeenTimestamp: Math.floor(Date.now() / 1e3),
        seenOnRelays: [(client.relayList[0] as { url: string }).url],
      };
      console.log("#p1tYsu Found a new kind! 🚀🚀🚀");
      console.log(foundNewKind);
      console.log(event);
      try {
        const putResult = await fetch(`${WORKER_URL}/${kind}`, {
          method: "put",
          body: JSON.stringify(foundNewKind),
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: "1234",
          },
        });
        const putResultBody = await putResult.json();
        if (putResult.status !== 201 || putResultBody.success !== true) {
          const message = "#Uedt1e Failed to save found kind";
          console.error(message);
          console.error(putResultBody);
          console.error(putResult);
          throw new Error(message);
        }
      } catch (error) {
        console.error("#HDufs6 Failed to PUT new kind", error);
        return;
      }
    }
    client.disconnect();
  }

  await awaitForEachWithDelay(
    Array.from({ length: options.relays.subscriptions }),
    async () => {
      const kinds = await getRandomKinds(
        options.kinds.perSubscription,
        options.kinds.maximum
      );
      log("#lMer4G Subscribing for kinds", kinds.join(", "));
      await Promise.all(
        clients.map(async (client) => await subscribeClient(client, kinds))
      );
    },
    options.relays.delay * 1e3
  );
};
