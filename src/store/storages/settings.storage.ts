import type {SettingsState} from 'store/settings.store'
import {persistStore} from 'store/storages/persist'

export const settingsStorage = persistStore.injectStorage<SettingsState>({
  forStore: 'settings'
})
