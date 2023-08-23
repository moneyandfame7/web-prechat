import type {ApiChat} from 'api/types'
import {persistStore} from 'store/storages/persist'

export const chatsStorage = persistStore.injectStorage<Record<string, ApiChat>>({
  forStore: 'chats'
})
