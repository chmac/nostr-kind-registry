import { DefaultOptionsWithLogger } from "./options.ts";
import { getAllRelays } from "./storage.ts";
import { randomItems } from "./utils.ts";

export const getRandomRelays = async (options: DefaultOptionsWithLogger) => {
  const relays = await getAllRelays(options);
  if (relays.length == 0) {
    throw new Error("#gIUf67 Could not get relays");
  }
  const count = Math.min(options.relays.count, relays.length);
  const selectedRelays = randomItems(relays, count);
  const relayUrls = selectedRelays.map((relay) => relay.url);
  return relayUrls;
};
