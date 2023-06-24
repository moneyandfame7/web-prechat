import { ObjectWithKey } from 'types/common'
import { DEBUG } from './config'

export function throwDebugError(error: string) {
  if (DEBUG) {
    throw new Error(error)
  }
  throw new Error('Oops... Something went wrong!')
}

export function omit<T extends object, K extends keyof T>(
  obj: T,
  ...keys: K[]
): ObjectWithKey<Omit<T, K>> {
  const result = { ...obj }

  keys.forEach((key) => {
    delete result[key]
  })

  return result
}
