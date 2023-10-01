import {type RefObject} from 'preact'
import {useEffect, useRef, useState} from 'preact/hooks'

import {debounce} from 'common/functions'
import {throttle} from 'utilities/schedulers/throttle'

interface Args {
  debounceMs?: number
  leading?: boolean
  margin?: number
  threshold?: number
  rootRef: RefObject<HTMLElement>
  throttleMs?: number
  isDisabled?: boolean
}
interface IntersectionRef {
  observer: IntersectionObserver
  callbacks: Map<HTMLElement, TargetCb>
}
type TargetCb = (entrry: IntersectionObserverEntry) => void
export type RootCb = (entries: IntersectionObserverEntry[]) => void
export type ObserveFn = (target: HTMLElement, targetCb?: TargetCb) => VoidFunction

interface Intersection {
  observe: ObserveFn
}

/**
 * @deprecated - Спиздив цей код, але хочу переписати сам. Колись.
 *  ( в кінці сторінки новий приклад, можливо )
 */
export function useIntersectionObserver(
  {threshold = 0, rootRef, margin, debounceMs, throttleMs, leading, isDisabled}: Args,
  rootCallback?: RootCb
): Intersection {
  const intersectionRef = useRef<IntersectionRef>()
  const rootCallbackRef = useRef<RootCb>()

  rootCallbackRef.current = rootCallback

  useEffect(() => {
    if (isDisabled) {
      return undefined
    }

    return () => {
      if (intersectionRef.current) {
        intersectionRef.current.observer.disconnect()
        intersectionRef.current.callbacks.clear()
        intersectionRef.current = undefined
      }
    }
  }, [isDisabled])

  const init = () => {
    const callbacks = new Map()
    const entriesMap = new Map<Element, IntersectionObserverEntry>()

    function observerHandler() {
      const entries = Array.from(entriesMap.values())

      entries.forEach((entry: IntersectionObserverEntry) => {
        const callback = callbacks.get(entry.target)
        if (callback) {
          callback!(entry, entries)
        }
      })

      if (rootCallbackRef.current) {
        rootCallbackRef.current(entries)
      }

      entriesMap.clear()
    }

    let cb: typeof observerHandler
    if (debounceMs) {
      cb = debounce(observerHandler, debounceMs, leading)
    } else if (throttleMs) {
      cb = throttle(observerHandler, throttleMs, leading)
    } else {
      cb = observerHandler
    }

    /**
     * @todo можливо прибрати цей map entry, просто в cb передавати та й все?
     */
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          entriesMap.set(entry.target, entry)
        })

        cb()
      },
      {
        root: rootRef.current,
        rootMargin: margin ? `${margin}px` : undefined,
        threshold,
      }
    )

    intersectionRef.current = {callbacks, observer}
  }
  const observe: ObserveFn = (target, targetCb) => {
    if (!intersectionRef.current) {
      init()
    }

    const intersection = intersectionRef.current!

    intersection.observer.observe(target)

    if (targetCb) {
      intersection.callbacks.set(target, targetCb)
    }

    return () => {
      if (targetCb) {
        intersection.callbacks.delete(target)
      }

      intersection.observer.unobserve(target)
    }
  }

  return {observe}
}

export function useOnIntersect(
  targetRef: RefObject<HTMLDivElement>,
  observe?: ObserveFn,
  callback?: TargetCb
) {
  useEffect(() => {
    return observe ? observe(targetRef.current!, callback) : undefined
  }, [callback, observe, targetRef])
}

export function useIsIntersecting(
  targetRef: RefObject<HTMLDivElement>,
  observe?: ObserveFn,
  callback?: TargetCb
) {
  const [isIntersecting, setIsIntersecting] = useState(!observe)

  useOnIntersect(targetRef, observe, (entry) => {
    setIsIntersecting(entry.isIntersecting)

    if (callback) {
      callback(entry)
    }
  })

  return isIntersecting
}

// function useIntersectionObserver({
//   rootRef,
//   rootMargin,
//   threshold
// }, callback) {

//   const observerRef = useRef();

//   useEffect(() => {
//     const observer = new IntersectionObserver(callback, {
//       root: rootRef.current,
//       rootMargin,
//       threshold
//     });

//     observerRef.current = observer;

//     return () => observer.disconnect();

//   }, [rootRef, rootMargin, threshold, callback]);

//   return observerRef.current;

// }

// function MyComponent() {

//   const callback = (entries) => {
//     // callback logic
//   };

//   const observer = useIntersectionObserver({
//     rootRef,
//     rootMargin: '0px 0px -200px 0px',
//     threshold: 1.0
//   }, debounce(callback, 500));

//   useEffect(() => {
//     observer.observe(targetRef.current);

//     return () => observer.unobserve(targetRef.current);
//   }, [observer]);

// }
