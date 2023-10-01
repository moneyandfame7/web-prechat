import {cleanTypename} from './cleanupTypename'

function cleanObject(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map((i) => cleanObject(i))
  }

  if (typeof obj !== 'object' || obj === null) {
    return obj
  }

  const cleaned: any = {}

  Object.keys(obj).forEach((key) => {
    const value = obj[key]

    if (value === null) {
      return
    }

    if (typeof value === 'object') {
      cleaned[key] = cleanObject(value)
    } else {
      cleaned[key] = value
    }
  })

  return cleaned
}
export function cleanupResponse<T>(data: T): T {
  return cleanTypename(cleanObject(data))
}
