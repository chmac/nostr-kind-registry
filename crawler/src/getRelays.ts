import { WORKER_URL } from "../constants.ts";

export const getRelays = async (count: number) => {
  const result = await fetch(
    `${WORKER_URL}/relays/random?count=${count.toString()}`
  );
  const relays = (await result.json()) as { url: string }[];
  const relayUrls = relays.map((relay) => relay.url);
  return relayUrls;
};
