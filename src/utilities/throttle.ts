// export const throttle = <R, A extends any[]>(
//   fn: (...args: A) => R,
//   delay: number
// ): [(...args: A) => R | undefined, () => void] => {
//   let wait = false
//   let timeout: undefined | number
//   let cancelled = false

import {AnyFunction} from 'types/common'

//   return [
//     (...args: A) => {
//       if (cancelled) return undefined
//       if (wait) return undefined

//       const val = fn(...args)

//       wait = true

//       timeout = window.setTimeout(() => {
//         wait = false
//       }, delay)

//       return val
//     },
//     () => {
//       cancelled = true
//       clearTimeout(timeout)
//     }
//   ]
// }

export function throttle<F extends AnyFunction>(fn: F, ms: number, leading = true) {
  let interval: number | undefined
  let isPending: boolean
  let args: Parameters<F>

  return (..._args: Parameters<F>) => {
    isPending = true
    args = _args

    if (!interval) {
      if (leading) {
        isPending = false
        fn(...args)
      }

      // eslint-disable-next-line no-restricted-globals
      interval = self.setInterval(() => {
        if (!isPending) {
          // eslint-disable-next-line no-restricted-globals
          self.clearInterval(interval!)
          interval = undefined
          return
        }

        isPending = false
        fn(...args)
      }, ms)
    }
  }
}
