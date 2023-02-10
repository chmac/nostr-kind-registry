import { DefaultOptionsWithLogger } from "./options.ts";
import { getAllRelays } from "./storage.ts";
import { randomItems } from "./utils.ts";

/**
 * IDEA
 *
 * - Get relays from https://api.nostr.watch/v1/online
 * - Cache response
 */

export const getRandomRelays = async (
  options: DefaultOptionsWithLogger,
  count: number
) => {
  const relays = await getAllRelays(options);
  if (relays.length == 0) {
    throw new Error("#gIUf67 Could not get relays");
  }

  const realCount = Math.min(count, relays.length);
  const selectedRelays = randomItems(relays, realCount);
  const relayUrls = selectedRelays.map((relay) => relay.url);
  return relayUrls;
};
