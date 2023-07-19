import { type VNode, cloneElement } from 'preact'
import { memo } from 'preact/compat'
import {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState
} from 'preact/hooks'

import {
  EventMapping,
  computeClassName,
  joinClassNames,
  mergeRefs
} from './helpers'
import type {
  PhaseEvent
} from './types';
import {
  type CSSTransitionClassNames,
  Phase,
  type TransitionProps,
  type TransitionState
} from './types'

/* Create also hook? Provide all props  */
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
interface HookTransitionProps {
  shouldRender: boolean
  appear?: boolean
  enter?: boolean
  exit?: boolean
  duration?: number
  className?: CSSTransitionClassNames
  absoluted?: boolean
}
export function useTransition(
  props: HookTransitionProps & {
    [key in PhaseEvent]?: () => void
  }
) {
  const tmRef = useRef<number>()
  const {
    shouldRender = false,
    appear = false,
    enter = true,
    exit = true,
    duration = 500,
    className = '',
    absoluted = false
  } = props
  let ignoreInPropChange = false

  const [phase, setPhase] = useState(() => {
    ignoreInPropChange = true
    if (!shouldRender) {
      return Phase.EXIT_DONE
    }
    if (appear) {
      return Phase.APPEAR
    }
    return Phase.APPEAR_DONE
  })

  useEffect(() => {
    const { setTimeout, clearTimeout } = window
    const [eventName, nextPhase, delay] = EventMapping[phase]
    props[eventName]?.()

    if (nextPhase) {
      if (delay) {
        tmRef.current = setTimeout(setPhase, duration, nextPhase)
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
      if (shouldRender) {
        setPhase(enter ? Phase.ENTER : Phase.ENTER_DONE)
      } else {
        setPhase(exit ? Phase.EXIT : Phase.EXIT_DONE)
      }
    }
  }, [shouldRender])

  const finalClassName = joinClassNames(
    computeClassName(phase, className),
    absoluted ? 'transition-absolute' : undefined
  )

  return finalClassName
}
