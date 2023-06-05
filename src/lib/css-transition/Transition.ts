import { type VNode, cloneElement } from 'preact'
import { memo } from 'preact/compat'
import {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState
} from 'preact/hooks'

import { EventMapping, mergeRefs } from './helpers'
import { Phase, type TransitionProps, type TransitionState } from './types'

export default memo((props: TransitionProps): VNode | null => {
  const {
    children,
    in: inProp = false,
    appear = false,
    enter = true,
    exit = true,
    duration = 500,
    alwaysMounted = false,
    addEndListener
  } = props
  const nodeRef = useRef<Element>()
  const tmRef = useRef<number>()
  let ignoreInPropChange = false
  // Make state
  const [phase, setPhase] = useState(() => {
    ignoreInPropChange = true
    if (!inProp) {
      return Phase.EXIT_DONE
    }
    if (appear) {
      return Phase.APPEAR
    }
    return Phase.APPEAR_DONE
  })

  // Effect for phase change
  useEffect(() => {
    const { setTimeout, clearTimeout } = window
    const [eventName, nextPhase, delay] = EventMapping[phase]
    props[eventName]?.(nodeRef.current)

    if (nextPhase) {
      if (delay) {
        if (addEndListener && nodeRef.current) {
          addEndListener(nodeRef.current, () => setPhase(nextPhase))
        } else {
          tmRef.current = setTimeout(setPhase, duration, nextPhase)
        }
      } else {
        setPhase(nextPhase)
      }
    }
    return () => {
      clearTimeout(tmRef.current)
    }
  }, [phase, duration])

  // Effect for initial phase
  useLayoutEffect(() => {
    if (!ignoreInPropChange) {
      if (inProp) {
        setPhase(enter ? Phase.ENTER : Phase.ENTER_DONE)
      } else {
        setPhase(exit ? Phase.EXIT : Phase.EXIT_DONE)
      }
    }
  }, [inProp])

  // Make transition state
  const transitionState = useMemo(() => {
    const value = {} as TransitionState
    Object.values(Phase).forEach((val) => {
      value[val] = phase === val
    })
    return value
  }, [phase])

  // Do not render anything
  if (!alwaysMounted && phase === Phase.EXIT_DONE) {
    return null
  }

  // Render child
  const child = children(transitionState, phase)
  return cloneElement(child, { ref: mergeRefs([nodeRef, child.ref || null]) })
})
