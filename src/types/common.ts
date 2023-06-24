export type DeepPartial<T> = {
  [P in keyof T]?: DeepPartial<T[P]>
}

export type ObjectWithKey<T> = { [K in keyof T]: T[K] }
