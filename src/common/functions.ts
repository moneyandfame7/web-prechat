import { DEBUG } from './config'

export function throwDebugError(error: string) {
  if (DEBUG) {
    throw new Error(error)
  }
  throw new Error('Oops... Something went wrong!')
}
