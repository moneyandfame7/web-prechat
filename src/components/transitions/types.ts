import type {ComponentChildren, RefObject} from 'preact'
import type {CSSProperties, HTMLAttributes, TargetedEvent} from 'preact/compat'

import type {CSSTransitionClassNames} from 'react-transition-group/CSSTransition'

import {ObjectOrValue} from 'types/common'

export type TransitionName =
  | 'slide'
  | 'slideY'
  | 'slideFade'
  | 'slideFadeY'
  | 'zoomSlide'
  | 'zoomFade'
  | 'fade'
  | 'slideDark'
  | 'rotate'
  | 'rotate3d'
  | 'zoomIcon'
export type TransitionEasing = 'ease' | 'ease-in' | 'ease-in-out' | 'ease-out' | 'linear'
export type TransitionDirection = 'auto' | 'inverse' | 1 | -1
export interface TransitionProps<TKey extends number | string> {
  elRef?: RefObject<HTMLDivElement>
  activeKey: TKey
  appear?: boolean
  name: TransitionName
  children: ComponentChildren
  direction?: TransitionDirection
  shouldCleanup?: boolean
  isLayout?: boolean
  cleanupException?: TKey
  cleanupElements?: TKey[]
  shouldLockUI?: boolean
  containerClassname?: string
  innerClassnames?: Partial<ObjectOrValue<TKey, string>>
  timeout?: number
  onExitEnd?: VoidFunction
  innerAttributes?: Partial<{[key in TKey]: HTMLAttributes<HTMLDivElement>}>
}
export interface SingleTransitionProps {
  name: TransitionName
  in?: boolean
  unmount?: boolean
  shouldSkip?: boolean
  shouldLockUI?: boolean
  direction?: TransitionDirection
  visibilityHidden?: boolean
  onEnter?: () => void
  toggle?: boolean
  /**
   * If used async component, must use appear....
   */
  appear?: boolean
  className?: string
  transitionClassnames?: CSSTransitionClassNames
  timeout?: number
  easing?: TransitionEasing
  children: ComponentChildren
  onClick?: (e: TargetedEvent<HTMLDivElement, MouseEvent>) => void
  onMouseLeave?: (e: TargetedEvent<HTMLDivElement, MouseEvent>) => void
  onMouseEnter?: (e: TargetedEvent<HTMLDivElement, MouseEvent>) => void
  onExited?: (node?: Element) => void
  onEntered?: (node?: Element) => void
  onMouseDown?: (e: TargetedEvent<HTMLDivElement, MouseEvent>) => void
  key?: string | number
  elRef?: RefObject<HTMLDivElement>
  styles?: CSSProperties
  divAttributes?: HTMLAttributes<HTMLDivElement>
}
