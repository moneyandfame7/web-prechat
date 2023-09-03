import {useEffect, useLayoutEffect, useRef} from 'preact/hooks'

/**
 * https://usehooks-ts.com/react-hook/use-interval
 */
export function useInterval(callback: () => void, delay: number | null, leading = false) {
  const savedCallback = useRef(callback)

  // Remember the latest callback if it changes.
  useLayoutEffect(() => {
    savedCallback.current = callback
  }, [callback])

  // Set up the interval.
  useEffect(() => {
    // Don't schedule if no delay is specified.
    // Note: 0 is a valid value for delay.
    if (!delay && delay !== 0) {
      return
    }
    if (leading) {
      savedCallback.current()
    }

    const id = setInterval(() => savedCallback.current(), delay)

    return () => clearInterval(id)
  }, [delay])
}
