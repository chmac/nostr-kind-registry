const MAX = 40e3;

const getRandomKind = (max: number) => Math.floor(Math.random() * max);

// deno-lint-ignore require-await
export const getRandomKinds = async (count: number, max = MAX) => {
  return Array.from({ length: count }).map(() => getRandomKind(max));
};
