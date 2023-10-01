export function removeNull<T extends object>(obj: T): T {
  for (const key in obj) {
    // eslint-disable-next-line no-prototype-builtins
    if (obj.hasOwnProperty(key)) {
      const value = obj[key]
      if (value === null) {
        delete obj[key]
      } else if (typeof value === 'object') {
        obj[key] = removeNull(value)
      }
    }
  }

  return obj
}

// export function cleanupResponse<T>(data:T):T{

//   return cleanTypename()
// }
