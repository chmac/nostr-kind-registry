const MAX = 40e3;
const getRandomKind = () => Math.floor(Math.random() * MAX);

// deno-lint-ignore require-await
export const getRandomKinds = async (count: number) => {
  return Array.from({ length: count }).map(getRandomKind);
};
