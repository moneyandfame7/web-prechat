import {createPersistStore} from 'lib/store/persist/createPersistStore'
// import type {AppCombinedStore} from 'store/combined'

export const persistStore = createPersistStore({
  databaseName: 'prechat-state',
  storages: {
    auth: {
      name: 'authorization'
    },
    settings: {
      name: 'settings'
    },
    users: {
      name: 'users',
      optionalParameters: {
        keyPath: 'id'
      }
    },
    chats: {
      name: 'chats',
      optionalParameters: {
        keyPath: 'id'
      }
    }
  },
  version: 1
})
