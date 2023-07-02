import type { AnyFunction, ObjectWithKey } from 'types/common'

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
export function debounce<F extends AnyFunction>(
  fn: F,
  ms: number,
  shouldRunFirst = true,
  shouldRunLast = true
) {
  let waitingTimeout: number | undefined
  return (...args: Parameters<F>) => {
    if (waitingTimeout) {
      clearTimeout(waitingTimeout)
      waitingTimeout = undefined
    } else if (shouldRunFirst) {
      fn(...args)
    }

    waitingTimeout = setTimeout(() => {
      if (shouldRunLast) {
        fn(...args)
      }

      waitingTimeout = undefined
    }, ms)
  }
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
