import type {AnyFunction} from 'types/common'

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
