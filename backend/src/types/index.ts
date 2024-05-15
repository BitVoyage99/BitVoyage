export type StringifyValues<T> = {
  [K in keyof T]: T[K] extends number ? string : T[K];
};
