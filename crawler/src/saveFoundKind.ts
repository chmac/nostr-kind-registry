import { KindMeta, NostrEvent } from "../../shared/types.ts";
import { GlobalOptions, LoggerOption } from "./options.ts";
import { writeKindMeta } from "./storage.ts";

export const saveFoundKind = async ({
  options,
  event,
  relayUrl,
}: {
  options: GlobalOptions & LoggerOption;
  event: NostrEvent;
  relayUrl: string;
}) => {
  const { logger } = options;
  const { kind } = event;

  const newKindMeta: KindMeta = {
    kind,
    seen: true,
    firstSeenDateString: new Date().toISOString(),
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
