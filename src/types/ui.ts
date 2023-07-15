import type { Signal } from '@preact/signals'
import type { TargetedEvent } from 'preact/compat'

/* LEFT */
export enum LeftColumnScreen {
  Main = 'Main',
  Settings = 'Settings',
  Create = 'Create',
  Contacts = 'Contacts'
}
export interface LeftColumnStore {
  resetScreen: () => void
  activeScreen: LeftColumnScreen
  setScreen: (screen: LeftColumnScreen) => void
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
export type MouseClickHandler<T extends HTMLElement> = (e: TargetedEvent<T, MouseEvent>) => void

export type MouseHandler = (e: MouseEvent) => void
export type Size = 'small' | 'medium' | 'large'

export type SignalOrString = string | Signal<string> | undefined
