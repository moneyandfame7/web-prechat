export type DeepPartial<T> = {
  [P in keyof T]?: DeepPartial<T[P]>
}

export type DeepPartialPersist<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartialPersist<T[P]> | true : true
}

export type ObjectWithKey<T> = { [K in keyof T]: T[K] }

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyFunction = (...args: any[]) => void
