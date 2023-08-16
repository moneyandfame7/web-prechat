/* eslint-disable @typescript-eslint/no-explicit-any */
export type DeepPartial<T> = {
  [P in keyof T]?: DeepPartial<T[P]>
}

/**
 * @example
 * type Something = ObjectOrValue<string, unknown>
 * // unknown | {[key: string]: unknown}
 */
export type ObjectOrValue<TKey extends string | number, TValue> =
  | Record<TKey, TValue>
  | TValue

export type AnyFunction = (...args: any[]) => void
export type AnyObject = Record<string, any>
