// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function areArraysEqual<T1 extends any[], T2 extends any[]>(arr1: T1, arr2: T2) {
  return arr1.length === arr2.length && arr1.every((val, i) => val === arr2[i])
}
