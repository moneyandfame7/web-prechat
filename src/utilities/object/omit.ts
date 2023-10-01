// export function omit<T, K extends keyof T>(obj: T, keys: K[]): Omit<T, K> {
//   const clone = {...obj} as T
//   keys.forEach((key) => delete clone[key])
//   return clone
import {pick} from './pick'

// export const omit = <T extends object, K extends keyof T>(obj: T, keys: K[]): Omit<T, K> => {
//   const toSaveKeys = Object.keys(obj).filter((k) => !keys.includes(k as K)) as Array<
//     Exclude<keyof T, K>
//   >

//   return pick(obj, toSaveKeys)
// }

export function omit<T extends object, K extends keyof T>(obj: T, keys: K[]): Omit<T, K> {
  const result = {} as Omit<T, K>

  for (const key in obj) {
    if (obj.hasOwnProperty(key) && !keys.includes(key as K)) {
      result[key] = obj[key]
    }
  }

  return result
}
