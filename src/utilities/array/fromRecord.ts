export function fromRecord<T>(obj: Record<string, T>): T[] {
  return Object.keys(obj).map((id) => {
    return obj[id]
  })
}
