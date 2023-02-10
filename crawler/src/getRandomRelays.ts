import { DefaultOptionsWithLogger } from "./options.ts";
import { getAllRelayUrls } from "./storage.ts";
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
  const relayUrls = await getAllRelayUrls(options);

  if (relayUrls.length == 0) {
    throw new Error("#Sgiznl Could not get relays");
  }

  const realCount = Math.min(count, relayUrls.length);
  const selectedRelayUrls = randomItems(relayUrls, realCount);
  return selectedRelayUrls;
};
