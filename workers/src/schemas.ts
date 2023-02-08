import { z } from "zod";

export const KindMetaSchema = z.object({
  kind: z.number().int(),
  seen: z.boolean(),
  firstSeenTimestamp: z.number().int().optional(),
  seenOnRelays: z.string().array().optional(),
  relatedNips: z.number().int().array().optional(),
  implementationUrls: z.string().array().optional(),
});

export type KindMeta = z.infer<typeof KindMetaSchema>;

export const RelaySchema = z.object({
  url: z.string().url(),
});
