import type {Signal} from '@preact/signals'
import type {VNode} from 'preact'
import type {StateUpdater, TargetedEvent} from 'preact/compat'

import type {LeftColumnScreen} from './screens'

export interface LeftColumnStore {
  resetScreen: (force?: boolean) => void
  activeScreen: LeftColumnScreen
  setScreen: StateUpdater<LeftColumnScreen>
}

/* PREACT */
export type InputHandler = (e: TargetedEvent<HTMLInputElement, Event>) => void
export type InputHandlerValue = (value: string) => void
export type MouseClickHandler<T extends HTMLElement> = (
  e: TargetedEvent<T, MouseEvent>
) => void

export type MouseHandler = (e: MouseEvent) => void
export type Size = 'small' | 'medium' | 'large'
export type Orientation = 'vertical' | 'horizontal'
export type SignalOrString = string | Signal<string> | undefined

export type SignalOr<T> = Signal<T> | T
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface VNodeWithKey<TKey, TProps = any> extends VNode<TProps> {
  key: TKey
}
export type PreactNode = string | number | boolean | VNode | PreactNode[]
export type Key = string | number
