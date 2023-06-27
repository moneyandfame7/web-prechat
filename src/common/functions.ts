import { ObjectWithKey } from 'types/common'
import { DEBUG } from './config'

export function throwDebugError(error: string) {
  if (DEBUG) {
    throw new Error(error)
  }
  throw new Error('Oops... Something went wrong!')
}

export function omit<T extends object, K extends keyof T>(
  obj: T,
  ...keys: K[]
): ObjectWithKey<Omit<T, K>> {
  const result = { ...obj }

  keys.forEach((key) => {
    delete result[key]
  })

  return result
}

export function convertMs(ms: number) {
  let seconds = Math.floor(ms / 1000)
  let minutes = Math.floor(seconds / 60)
  let hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  seconds %= 60
  minutes %= 60
  hours %= 24

  return {
    days: days,
    hours: hours,
    minutes: minutes,
    seconds: seconds
  }
}
