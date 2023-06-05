import type { VNode } from 'preact'

export enum Phase {
  APPEAR = 'appear',
  APPEAR_ACTIVE = 'appearActive',
  APPEAR_DONE = 'appearDone',
  ENTER = 'enter',
  ENTER_ACTIVE = 'enterActive',
  ENTER_DONE = 'enterDone',
  EXIT = 'exit',
  EXIT_ACTIVE = 'exitActive',
  EXIT_DONE = 'exitDone'
}

export enum PhaseEvent {
  ENTER = 'onEnter',
  ENTERING = 'onEntering',
  ENTERED = 'onEntered',
  EXIT = 'onExit',
  EXITING = 'onExiting',
  EXITED = 'onExited'
}

export type TransitionState = {
  [key in Phase]: boolean
}

export type TransitionProps = {
  [key in PhaseEvent]?: (node?: Element) => void
} & {
  children: (transitionState: TransitionState, activePhase: Phase) => VNode
  in: boolean
  appear?: boolean
  enter?: boolean
  exit?: boolean
  duration: number
  alwaysMounted: boolean
  addEndListener?: (node: Element, done: () => void) => void
}

export type CSSTransitionClassNames =
  | string
  | {
      [key in Phase]?: string
    }

export type CSSTransitionProps = Omit<TransitionProps, 'children'> & {
  children: VNode<{ className: string }>
  classNames: CSSTransitionClassNames
}
