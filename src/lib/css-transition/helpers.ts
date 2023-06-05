import { Ref, RefCallback, RefObject } from 'preact'

import { type CSSTransitionClassNames, Phase, PhaseEvent } from './types'

export const Suffix: {
  [key in Phase]: string
} = {
  [Phase.APPEAR]: '-appear',
  [Phase.APPEAR_ACTIVE]: '-appear-active',
  [Phase.APPEAR_DONE]: '-appear-done',
  [Phase.ENTER]: '-enter',
  [Phase.ENTER_ACTIVE]: '-enter-active',
  [Phase.ENTER_DONE]: '-enter-done',
  [Phase.EXIT]: '-exit',
  [Phase.EXIT_ACTIVE]: '-exit-active',
  [Phase.EXIT_DONE]: '-exit-done'
}

export const EventMapping: {
  [key in Phase]: [PhaseEvent, Phase?, boolean?]
} = {
  [Phase.APPEAR]: [PhaseEvent.ENTER, Phase.APPEAR_ACTIVE],
  [Phase.APPEAR_ACTIVE]: [PhaseEvent.ENTERING, Phase.APPEAR_DONE, true],
  [Phase.APPEAR_DONE]: [PhaseEvent.ENTERED],
  [Phase.ENTER]: [PhaseEvent.ENTER, Phase.ENTER_ACTIVE],
  [Phase.ENTER_ACTIVE]: [PhaseEvent.ENTERING, Phase.ENTER_DONE, true],
  [Phase.ENTER_DONE]: [PhaseEvent.ENTERED],
  [Phase.EXIT]: [PhaseEvent.EXIT, Phase.EXIT_ACTIVE],
  [Phase.EXIT_ACTIVE]: [PhaseEvent.EXITING, Phase.EXIT_DONE, true],
  [Phase.EXIT_DONE]: [PhaseEvent.EXITED]
}

const appendSuffix = (className: string, suffix: string): string =>
  `${className}${suffix}`

export const joinClassNames = (
  ...classNames: Array<CSSTransitionClassNames | undefined | string>
): string => classNames.filter((className) => !!className).join(' ')

export const recoverClassName = (
  phase: Phase,
  classNames: CSSTransitionClassNames
) =>
  typeof classNames === 'string'
    ? appendSuffix(classNames, Suffix[phase])
    : classNames[phase]

export const computeClassName = (
  phase: Phase,
  classNames: CSSTransitionClassNames
) => {
  const className = recoverClassName(phase, classNames)
  switch (phase) {
    case Phase.APPEAR_ACTIVE:
      return joinClassNames(
        recoverClassName(Phase.APPEAR, classNames),
        className
      )
    case Phase.ENTER_ACTIVE:
      return joinClassNames(
        recoverClassName(Phase.ENTER, classNames),
        className
      )
    case Phase.EXIT_ACTIVE:
      return joinClassNames(recoverClassName(Phase.EXIT, classNames), className)
    default:
      return className
  }
}

export function mergeRefs<T>(refs: Array<Ref<T>>): RefCallback<T> {
  return (value) => {
    refs.forEach((ref) => {
      if (typeof ref === 'function') {
        ref(value)
      } else if (ref != null) {
        ;(ref as RefObject<T | null>).current = value
      }
    })
  }
}
