import { DefaultOptionsWithLogger } from "./options.ts";
import { getKinds } from "./storage.ts";
import { randomItems } from "./utils.ts";

// NOTE: Kinds 20'000 - 29'999 are excluded
const getAllKinds = (max: number) => {
  const allKinds = Array.from({ length: max }).map((_, i) => i);
  const withoutExcluded = allKinds.slice(0, 20e3).concat(allKinds.slice(30e3));
  return withoutExcluded;
};

export const getRandomKinds = async (options: DefaultOptionsWithLogger) => {
  const count = options.kinds.perSubscription;
  const max = options.kinds.maximum;
  const seenKinds = await getKinds(options);
  const allKinds = getAllKinds(max);
  const unseenKinds = allKinds.filter((kind) => !seenKinds.includes(kind));
  const randomKinds = randomItems(unseenKinds, count);
  return randomKinds;
};
