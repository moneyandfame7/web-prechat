export function deepClone<T>(obj: T): T {
  // console.time('deepClone')
  return JSON.parse(JSON.stringify(obj))
  // const cloned = structuredClone(obj)
  // console.timeEnd('deepClone')
}
