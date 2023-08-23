import type {ApiUser} from 'api/types'
import {persistStore} from 'store/storages/persist'

export const usersStorage = persistStore.injectStorage<Record<string, ApiUser>>({
  forStore: 'users'
})
