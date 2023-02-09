import { log } from "./deps.ts";

export type Options = {
  relays: {
    count: number;
    subscriptions: number;
    delay: number;
  };
  kinds: {
    perSubscription: number;
    maximum: number;
  };
  dataPath: string;
  dataRepoUrl: string;
  verbose?: boolean;
  debug?: boolean;
  silent?: boolean;
  logger: log.Logger;
};
