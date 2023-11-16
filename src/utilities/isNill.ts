import type {Nillable} from 'types/common'

export function isNotNill<T>(variable: T): variable is NonNullable<T> {
  return variable !== null && variable !== undefined
}

export function isNill<T>(variable: Nillable<T>): variable is undefined | null {
  return variable === null || variable === undefined
}
