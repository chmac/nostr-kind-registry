export type WORKER_OUTPUT_SEEN_KINDS = {
  kinds: number[];
};

export type WORKER_OUTPUT_KIND_SINGLE = {
  kind: KindMeta;
};

export type WORKER_OUTPUT_RELAY_SINGLE = {
  url: string;
};

export type WORKER_OUTPUT_RELAYS = WORKER_OUTPUT_RELAY_SINGLE[];

export type KindMeta = {
  kind: number;
  seen: boolean;
  firstSeenTimestamp?: number;
  seenOnRelays?: string[];
  relatedNips?: number[];
  implementationUrls?: string[];
};

// Copied from nostr-tools
export type NostrEvent = {
  id: string;
  sig: string;
  kind: number;
  tags: string[][];
  pubkey: string;
  content: string;
  created_at: number;
};
