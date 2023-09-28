import type {Signal} from '@preact/signals'
import type {VNode} from 'preact'
import type {StateUpdater, TargetedEvent} from 'preact/compat'

/* LEFT */
/* мейбі прибрати назви і використовувати для першого ключа === 0??? */
export enum LeftColumnScreen {
  Chats,
  Search,
  Settings,
  Archived,
  NewChannelStep1,
  NewChannelStep2,
  NewGroupStep1,
  NewGroupStep2,
  Contacts,
  MyStories,
}
export enum LeftColumnGroup {
  Main,
  Settings,
  Contacts,
  Archived,
  NewChannel,
  NewGroup,
  MyStories,
}
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

export type SignalOrString = string | Signal<string> | undefined

export type SignalOr<T> = Signal<T> | T
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface VNodeWithKey<TKey, TProps = any> extends VNode<TProps> {
  key: TKey
}
export type PreactNode = string | number | boolean | VNode | PreactNode[]
export type Key = string | number
