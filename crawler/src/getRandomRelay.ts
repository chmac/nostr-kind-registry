import { DefaultOptionsWithLogger } from "./options.ts";
import { getAllRelays } from "./storage.ts";
import { randomItem } from "./utils.ts";

export const getRandomRelay = async (options: DefaultOptionsWithLogger) => {
  const relays = await getAllRelays(options);
  if (relays.length == 0) {
    throw new Error("#gIUf67 Could not get relays");
  }

  const selectedRelay = randomItem(relays);
  return selectedRelay.url;
};
