import type {AuthState} from 'store/auth.store'
import {persistStore} from 'store/storages/persist'

export const authStorage = persistStore.injectStorage<AuthState>({
  forStore: 'auth'
})
