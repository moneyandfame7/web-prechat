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

export interface TransitionProps<TKey extends number> {
  activeKey: TKey
  name: TransitionName
  children: ComponentChildren
  direction?: 'auto' | 'inverse' | 1 | -1
  shouldCleanup?: boolean
  cleanupException?: TKey
  containerClassname?: string
  innerClassnames?: string | {[key in TKey]: string}
  timeout?: number
}
export interface SingleTransitionProps {
  name: TransitionName
  in?: boolean
  unmount?: boolean
  /**
   * If used async component, must use appear....
   */
  appear?: boolean
  className?: string
  transitionClassnames?: CSSTransitionClassNames
  timeout?: number
  children: ComponentChildren
  onClick?: (e: TargetedEvent<HTMLDivElement, MouseEvent>) => void
  onExited?: (node?: Element) => void
  onEntered?: (node?: Element) => void
  key?: string | number
  elRef?: RefObject<HTMLDivElement>
  styles?: CSSProperties
}
