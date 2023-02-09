import { KindMeta, NostrEvent } from "../../shared/types.ts";
import { Options } from "../types.ts";
import { writeKindMeta } from "./storage.ts";

export const saveFoundKind = async ({
  options,
  event,
  relayUrl,
}: {
  options: Options;
  event: NostrEvent;
  relayUrl: string;
}) => {
  const { logger } = options;
  const { kind } = event;

  const newKindMeta: KindMeta = {
    kind,
    seen: true,
    firstSeenTimestamp: Math.floor(Date.now() / 1e3),
    seenOnRelays: [relayUrl],
  };

  logger.info("#p1tYsu Found a new kind! 🚀🚀🚀");
  logger.info(newKindMeta);
  logger.info(event);

  try {
    await writeKindMeta(options, newKindMeta);
  } catch (error) {
    console.error("#HDufs6 Failed to save new kind", error);
  }
};
