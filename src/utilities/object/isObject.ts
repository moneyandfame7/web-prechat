import type {AnyObject} from 'types/common'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isObject(obj: any): obj is AnyObject {
  return obj && typeof obj === 'object'
}
