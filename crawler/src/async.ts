import { async } from "../deps.ts";

export const awaitForEach = async <T>(
  input: T[],
  iterator: (element: T) => Promise<void>
) => {
  await input.reduce(async (last, currentValue) => {
    await last;
    await iterator(currentValue);
  }, Promise.resolve());
};

export const awaitForEachWithDelay = async <T>(
  input: T[],
  iterator: (element: T) => Promise<void>,
  delayMs: number
) => {
  await input.reduce(async (last, currentValue, index) => {
    await last;
    await iterator(currentValue);
    if (index < input.length) {
      await async.delay(delayMs);
    }
  }, Promise.resolve());
};
