export function filterUnique<T>(arr: T[]) {
  return Array.from(new Set(arr))
}
