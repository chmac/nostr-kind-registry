import { FlagOptions } from "./options.ts";

export const randomItem = <T>(input: T[]): T =>
  input[Math.floor(Math.random() * input.length)];

// TODO - This should not return duplicates
export const randomItems = <T>(input: T[], count: number): T[] =>
  Array.from({ length: count }).map(() => randomItem(input));

export const calculateLogLevel = (options: FlagOptions) => {
  if (options.debug) {
    return "DEBUG";
  }
  if (options.verbose) {
    return "ERROR";
  }
  if (options.silent) {
    return "CRITICAL";
  }
  return "INFO";
};
