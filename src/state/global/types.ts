import { DeepSignal } from 'deepsignal'
import { SupportedLanguages } from 'state/i18n/types'

export type Theme = 'light' | 'dark' | 'system'

export interface GlobalStateProperties {
  theme: Theme
  language: SupportedLanguages
}
export type GlobalState = DeepSignal<GlobalStateProperties>
