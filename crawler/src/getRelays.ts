import { WORKER_OUTPUT_RELAYS } from "../../shared/types.ts";
import { WORKER_URL } from "../constants.ts";

export const getRelays = async (count: number) => {
  const result = await fetch(
    `${WORKER_URL}/relays/random?count=${count.toString()}`
  );
  const relays = (await result.json()) as WORKER_OUTPUT_RELAYS;
  if (relays.length == 0 || result.status !== 200)
    throw new Error("could not get relays");
  const relayUrls = relays.map((relay) => relay.url);
  return relayUrls;
};
