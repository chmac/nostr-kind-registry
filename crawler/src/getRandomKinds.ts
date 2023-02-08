import { WORKER_OUTPUT_SEEN_KINDS } from "../../shared/types.ts";
import { WORKER_URL } from "../constants.ts";

const MAX = 40e3;

const getSeenKinds = async () => {
  const result = await fetch(`${WORKER_URL}`);
  const { kinds } = (await result.json()) as WORKER_OUTPUT_SEEN_KINDS;
  return kinds;
};

// NOTE: Kinds 20'000 - 29'999 are excluded
const getAllKinds = (max: number) => {
  const allKinds = Array.from({ length: max }).map((_, i) => i);
  const withoutExcluded = allKinds.slice(0, 20e3).concat(allKinds.slice(30e3));
  return withoutExcluded;
};

const randomItem = <T>(input: T[]): T =>
  input[Math.floor(Math.random() * input.length)];

const randomItems = <T>(input: T[], count: number): T[] =>
  Array.from({ length: count }).map(() => randomItem(input));

export const getRandomKinds = async (count: number, max = MAX) => {
  const seenKinds = await getSeenKinds();
  const allKinds = getAllKinds(max);
  const unseenKinds = allKinds.filter((kind) => !seenKinds.includes(kind));
  const randomKinds = randomItems(unseenKinds, count);
  return randomKinds;
};
