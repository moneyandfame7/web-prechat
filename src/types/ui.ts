import type {Signal} from '@preact/signals'
import type {VNode} from 'preact'
import type {StateUpdater, TargetedEvent} from 'preact/compat'

/* LEFT */
export enum LeftColumnScreen {
  Chats = 'Chats',
  Search = 'Search',
  Settings = 'Settings',
  NewChannelStep1 = 'NewChannelStep1',
  NewChannelStep2 = 'NewChannelStep2',
  NewGroupStep1 = 'NewGroupStep1',
  NewGroupStep2 = 'NewGroupStep2',
  Contacts = 'Contacts'
}
export enum LeftColumnGroup {
  Main = 'Main',
  Settings = 'Settings',
  Contacts = 'Contacts',
  NewChannel = 'NewChannel',
  NewGroup = 'NewGroup'
}
export interface LeftColumnStore {
  resetScreen: (force?: boolean) => void
  activeScreen: LeftColumnScreen
  setScreen: StateUpdater<LeftColumnScreen>
}

/* LEFT-MAIN */
export enum LeftColumnMainScreen {
  Chats = 'Chats',
  Search = 'Search'
}
export interface LeftColumnMainStore {
  resetScreen: () => void
  activeScreen: LeftColumnMainScreen
  setScreen: (screen: LeftColumnMainScreen) => void
}

export type InputHandler = (e: TargetedEvent<HTMLInputElement, Event>) => void
export type MouseClickHandler<T extends HTMLElement> = (
  e: TargetedEvent<T, MouseEvent>
) => void

export type MouseHandler = (e: MouseEvent) => void
export type Size = 'small' | 'medium' | 'large'

export type SignalOrString = string | Signal<string> | undefined
export interface VNodeWithKey<T> extends VNode {
  key: T
}
