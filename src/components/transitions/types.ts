import type {RefObject, VNode} from 'preact'
import type {CSSProperties} from 'preact/compat'
import type {ObjectOrValue} from 'types/common'
import type {VNodeWithKey} from 'types/ui'

/* Switch Transition */
export type TransitionProperties = Pick<TransitionProps, 'name' | 'duration'>
export interface TransitionCases {
  enter: TransitionProperties
  exit: TransitionProperties
}
export type TransitionScreenConfig<TKey extends string | number> = {
  [key in TKey]: {
    [key in TKey]?: TransitionCases
  }
}
export type SwitchTransitionRenderCb<TKey> = (activeKey: TKey) => VNodeWithKey<TKey>
export type GetTransitionByCase<TKey extends string | number> = (
  newKey: TKey,
  oldKey?: TKey
) => TransitionCases

export interface SwitchTransitionProps<TKey extends string | number> {
  activeKey: TKey
  cleanupException?: TKey[]
  shouldCleanup?: boolean
  children: /* SwitchTransitionRenderCb<TKey> */ VNode
  initial?: ObjectOrValue<TKey, boolean>
  name: TransitionName
  classNames?: ObjectOrValue<TKey, string>
  durations?: ObjectOrValue<TKey, number>
  getTransitionByCase?: GetTransitionByCase<TKey>
}

/* Transition */
export type TransitionName =
  | 'fade'
  | 'slide'
  | 'zoomFade'
  | 'slideFade'
  | 'slide-200'
  | 'slide-backward'
  | 'slide-200-backward'
  | 'slideFade-backward'

export type TransitionCb = (node?: Element) => void
export interface TransitionProps {
  isMounted: boolean
  name: TransitionName
  elRef?: RefObject<HTMLDivElement>
  duration?: number
  styles?: CSSProperties
  appear?: boolean
  alwaysMounted?: boolean
  children: VNode
  className?: string
  onStartTransition?: TransitionCb
  onEndTransition?: TransitionCb
}
