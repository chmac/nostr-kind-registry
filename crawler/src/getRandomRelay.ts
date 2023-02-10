import { DefaultOptionsWithLogger } from "./options.ts";
import { getAllRelayUrls } from "./storage.ts";
import { randomItem } from "./utils.ts";

export const getRandomRelay = async (options: DefaultOptionsWithLogger) => {
  const relays = await getAllRelayUrls(options);

  if (relays.length == 0) {
    throw new Error("#gIUf67 Could not get relays");
  }

  const selectedRelayUrl = randomItem(relays);
  return selectedRelayUrl;
};
