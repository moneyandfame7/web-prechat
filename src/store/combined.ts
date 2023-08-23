import {combineStores} from 'lib/store'
import {pick} from 'utilities/object/pick'

import {authStore} from './auth.store'
import {settingsStore} from './settings.store'
import {usersStore} from './users.store'
import {chatsStore} from './chats.store'
import {uiStore} from './ui.store'

import {authStorage} from './storages/auth.storage'
import {usersStorage} from './storages/users.storage'
import {chatsStorage} from './storages/chats.storage'

export const combinedStore = combineStores({
  auth: authStore,
  settings: settingsStore,
  users: usersStore,
  chats: chatsStore,
  ui: uiStore
})

export type AppCombinedStore = typeof combinedStore
export type AppActions = ReturnType<typeof combinedStore.getActions>
export type AppState = ReturnType<typeof combinedStore.getInitialState>

export async function forcePersist() {
  const state = combinedStore.getState()

  const pickedAuth = pick(state.auth, [
    'currentUserId',
    'session',
    'rememberMe',
    'phoneNumber'
  ])
  const pickedUsers = state.users.byId
  const pickedChats = state.chats.byId

  await Promise.all([
    authStorage.put(pickedAuth),

    usersStorage.put(pickedUsers),

    chatsStorage.put(pickedChats)
  ])
}
