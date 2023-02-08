export type WORKER_OUTPUT_SEEN_KINDS = {
  kinds: number[];
};

export type WORKER_OUTPUT_RELAYS = { url: string }[];

export type KindMeta = {
  seen: boolean;
  firstSeenTimestamp?: number;
  seenOnRelays?: string[];
  relatedNips?: number[];
  implementationUrls?: string[];
};
