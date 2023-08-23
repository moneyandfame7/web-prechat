import {deepCopy} from './deepCopy'

export function deepMerge(target: any, source: any): any {
  const result = deepCopy(target)

  for (const key in source) {
    if (Object.prototype.hasOwnProperty.call(source, key)) {
      if (
        typeof source[key] === 'object' &&
        source[key] !== null &&
        !Array.isArray(source[key])
      ) {
        if (
          !result.hasOwnProperty(key) ||
          typeof result[key] !== 'object' ||
          result[key] === null ||
          Array.isArray(result[key])
        ) {
          result[key] = {}
        }
        result[key] = deepMerge(result[key], source[key])
      } else {
        result[key] = source[key]
      }
    }
  }

  return result
}
