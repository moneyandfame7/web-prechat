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
export const debounce = <T extends AnyFunction>(fn: T, ms = 300, leading = true) => {
  let timeoutId: ReturnType<typeof setTimeout>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return function (this: any, ...args: Parameters<T>) {
    clearTimeout(timeoutId)

    if (leading) {
      fn.apply(this, args)
      leading = false
      return
    }
    timeoutId = setTimeout(() => fn.apply(this, args), ms)
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
