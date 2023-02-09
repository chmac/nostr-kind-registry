export const randomItem = <T>(input: T[]): T =>
  input[Math.floor(Math.random() * input.length)];

// TODO - This should not return duplicates
export const randomItems = <T>(input: T[], count: number): T[] =>
  Array.from({ length: count }).map(() => randomItem(input));
