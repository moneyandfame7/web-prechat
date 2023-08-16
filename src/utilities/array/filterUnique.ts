// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function filterUnique<T extends Array<any>>(arr: T) {
  return [new Set(...arr)] as T
}
