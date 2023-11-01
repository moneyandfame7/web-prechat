export function isNotNill<T>(variable: T): variable is NonNullable<T> {
  return variable !== null && variable !== undefined
}
