import type {ComponentChildren, RefObject} from 'preact'
import type {CSSProperties, TargetedEvent} from 'preact/compat'

import type {CSSTransitionClassNames} from 'react-transition-group/CSSTransition'

export type TransitionName =
  | 'slide'
  | 'slideFade'
  | 'slideFadeY'
  | 'zoomSlide'
  | 'zoomFade'
  | 'fade'
  | 'slideDark'
  | 'rotate'
export type TransitionDirection = 'auto' | 'inverse' | 1 | -1
export interface TransitionProps<TKey extends number | string> {
  activeKey: TKey
  name: TransitionName
  children: ComponentChildren
  direction?: TransitionDirection
  shouldCleanup?: boolean
  isLayout?: boolean
  cleanupException?: TKey
  shouldLockUI?: boolean
  containerClassname?: string
  innerClassnames?: string | {[key in TKey]: string}
  timeout?: number
  onExitEnd?: VoidFunction
}
export interface SingleTransitionProps {
  name: TransitionName
  in?: boolean
  unmount?: boolean
  shouldSkip?: boolean
  shouldLockUI?: boolean
  direction?: TransitionDirection
  onEnter?: () => void
  toggle?: boolean
  /**
   * If used async component, must use appear....
   */
  appear?: boolean
  className?: string
  transitionClassnames?: CSSTransitionClassNames
  timeout?: number
  children: ComponentChildren
  onClick?: (e: TargetedEvent<HTMLDivElement, MouseEvent>) => void
  onMouseLeave?: (e: TargetedEvent<HTMLDivElement, MouseEvent>) => void
  onMouseEnter?: (e: TargetedEvent<HTMLDivElement, MouseEvent>) => void
  onExited?: (node?: Element) => void
  onEntered?: (node?: Element) => void
  key?: string | number
  elRef?: RefObject<HTMLDivElement>
  styles?: CSSProperties
}
