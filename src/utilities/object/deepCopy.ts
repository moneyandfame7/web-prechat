import {isObject} from './isObject'

export function deepCopy<T>(obj: T): T {
  if (!isObject(obj)) {
    return obj
  }

  if (Array.isArray(obj)) {
    return obj.map(deepCopy) as typeof obj
  }

  return Object.keys(obj).reduce((acc, key) => {
    acc[key as keyof T] = deepCopy(obj[key as keyof T])
    return acc
  }, {} as T)
}
