/* eslint-disable @typescript-eslint/no-explicit-any */
export type DeepPartial<T> = {
  [P in keyof T]?: DeepPartial<T[P]>
}

export type DeepPartialPersist<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartialPersist<T[P]> | true : true
}

export type ObjectWithKey<T> = {[K in keyof T]: T[K]}

/**
 * @example
 * type Something = ObjectOrValue<string, unknown>
 * // unknown | {[key: string]: unknown}
 */
export type ObjectOrValue<TKey extends string | number, TValue> =
  | Record<TKey, TValue>
  | TValue

export type AnyFunction = (...args: any[]) => void
export type AnyObject = Record<any, any>
