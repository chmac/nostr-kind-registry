import { log } from "../deps.ts";

export const DEFAULT_LOG_LEVEL = "INFO";
const DEFAULT_DATA_PATH = "/data/";
const DEFAULT_RELAYS_IN_PARALLEL = 12;
const DEFAULT_RELAYS_SUBSCRIPTIONS = 1;
const DEFAULT_RELAYS_DELAY = 5;
const DEFAULT_KINDS_PER_SUBSCRIPTION = 200;
const DEFAULT_KINDS_MAXIMUM = 40_000;

type RequiredGlobalOptions = {
  dataRepoUrl: string;
};

type OptionalGlobalOptions = {
  dataPath: string;
};

export type GlobalOptions = RequiredGlobalOptions & OptionalGlobalOptions;

export type RequiredFlagOptions = {
  relays: {
    inParallel: number;
    subscriptions: number;
    delay: number;
  };
  kinds: {
    perSubscription: number;
    maximum: number;
  };
};

export type OptionalFlagOptions = {
  verbose?: boolean;
  debug?: boolean;
  silent?: boolean;
};

export type EnvOptions = {
  relaysInParallel: number;
  relaysSubscriptions: number;
  relaysDelay: number;
  kindsPerSubscription: number;
  kindsMaximum: number;
};

export type LoggerOption = {
  logger: log.Logger;
};

export type GlobalOptionsWithLogger = GlobalOptions & LoggerOption;

export type DefaultOptionsWithLogger = GlobalOptionsWithLogger &
  RequiredFlagOptions;

export const addDefaultOptionValues = (
  incoming: RequiredGlobalOptions &
    Partial<OptionalGlobalOptions> &
    Partial<RequiredFlagOptions> &
    OptionalFlagOptions &
    Partial<EnvOptions> &
    LoggerOption
): DefaultOptionsWithLogger => {
  // deno-lint-ignore no-unused-vars
  const { dataPath, relays, kinds, ...rest } = incoming;

  const withDefaults = {
    ...rest,
    dataPath: incoming.dataPath || DEFAULT_DATA_PATH,
    relays: {
      inParallel:
        incoming.relays?.inParallel ||
        incoming.relaysInParallel ||
        DEFAULT_RELAYS_IN_PARALLEL,
      subscriptions:
        incoming.relays?.subscriptions ||
        incoming.relaysSubscriptions ||
        DEFAULT_RELAYS_SUBSCRIPTIONS,
      delay:
        incoming.relays?.delay || incoming.relaysDelay || DEFAULT_RELAYS_DELAY,
    },
    kinds: {
      perSubscription:
        incoming.kinds?.perSubscription ||
        incoming.kindsPerSubscription ||
        DEFAULT_KINDS_PER_SUBSCRIPTION,
      maximum:
        incoming.kinds?.maximum ||
        incoming.kinds?.maximum ||
        DEFAULT_KINDS_MAXIMUM,
    },
  };

  incoming.logger.debug(
    "#0pCGGX Calculated options with defaults",
    withDefaults
  );

  return withDefaults;
};
