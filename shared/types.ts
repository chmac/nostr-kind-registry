export type WORKER_OUTPUT_SEEN_KINDS = {
  kinds: number[];
};

export type WORKER_OUTPUT_KIND_SINGLE = {
  kind: KindMeta;
};

export type Relay = {
  id: string;
  url: string;
};

export type WORKER_OUTPUT_RELAYS = Relay[];

// NOTE: This is not shared with `workers/src/schemas.ts` because that uses
// `zod` and we can't easily share zod schemas between node and deno code
export type KindMeta = {
  kind: number;
  seen: boolean;
  firstSeenDateString?: string;
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
