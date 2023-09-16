/* eslint-disable @typescript-eslint/no-explicit-any */
export type DeepPartial<T> = {
  [P in keyof T]?: T extends AnyObject ? DeepPartial<T[P]> : T[P]
}

/**
 * @example
 * type Something = ObjectOrValue<string, unknown>
 * // unknown | {[key: string]: unknown}
 */
export type ObjectOrValue<TKey extends string | number, TValue> = Record<TKey, TValue> | TValue

export type AnyFunction = (...args: any[]) => void
export type AnyObject = Record<string, any>
export type Split<S extends string> = S extends `${string}.${infer U}` ? U : S
export type Prettify<T> = {
  [K in keyof T]: T[K]
} & {} // eslint-disable-line

// type Split2<S extends string> = S extends `${string}{{${infer U}}}` ? U : S

// type FOR_SPLIT = 'Привіт, {{name}}'

// type S=Split2<FOR_SPLIT>
