import type {ApiChat} from 'api/types/chats'
import type {ApiUser} from 'api/types/users'
import type {AuthState, SettingsState, GlobalState} from 'types/state'

import {createPersistStore} from 'lib/store/persist'
import type {PersistIdbStorage, StoragesName} from 'lib/store/persist/types'
import {pick} from 'utilities/object/pick'
import {DEBUG} from 'common/config'

import {getGlobalState} from './signal'
import {
  updateAuthState,
  updateI18nState,
  updatePasscodeState,
  updateSettingsState,
  updateUsers
} from './updates'
import {updateChats} from './updates/chats'

const persistStore = createPersistStore({
  databaseName: 'prechat-state',
  version: 1,
  storages: [
    {
      name: 'auth'
    },
    {
      name: 'settings'
    },
    {
      name: 'chats',
      optionalParameters: {
        keyPath: 'id'
      }
    },
    {
      name: 'users',
      optionalParameters: {
        keyPath: 'id'
      }
    }
  ]
})

export const storages = {
  auth: persistStore.injectStorage<AuthState>({storageName: 'auth'}),
  settings: persistStore.injectStorage<SettingsState>({storageName: 'settings'}),
  users: persistStore.injectStorage<Record<string, ApiUser>>({storageName: 'users'}),
  chats: persistStore.injectStorage<Record<string, ApiChat>>({storageName: 'chats'})
} satisfies Record<StoragesName, PersistIdbStorage<any>>

const PERSIST_DISABLED = false

export function pickPersisted(state: GlobalState) {
  return {
    auth: pick(state.auth, ['userId', 'session', 'phoneNumber', 'rememberMe']),
    users: state.users.byId,
    chats: state.chats.byId,
    settings: state.settings
  }
}

export async function clearStorage() {
  await Promise.all(
    Object.keys(storages).map((storage) =>
      storages[storage as keyof typeof storages].clear()
    )
  )
}

export async function readStorage() {
  const [auth, settings, users, chats] = await Promise.all([
    storages.auth.get(),
    storages.settings.get(),
    storages.users.get(),
    storages.chats.get()
  ])

  return {auth, settings, users, chats}
}

export async function stopPersist() {
  persistStore.disable()
  await clearStorage() // ?
  // rootStore2.set
}

export async function hydrateStore() {
  if (PERSIST_DISABLED) {
    if (DEBUG) {
      // eslint-disable-next-line no-console
      console.error('PERSIST DISABLED IN const VARIABLE')
    }

    return
  }
  const {auth, settings, chats, users} = await readStorage()

  const global = getGlobalState()
  if (auth?.session || settings?.passcode.hasPasscode) {
    persistStore.enable()

    // MOVE TO "setGlobalState"
    if (auth) {
      updateAuthState(global, auth)
    }
    if (settings) {
      const {i18n, passcode, ...justSettingsForUpd} = settings
      updateSettingsState(global, justSettingsForUpd)
      updateI18nState(global, i18n)
      updatePasscodeState(global, passcode)
    }
    if (users) {
      updateUsers(global, users)
    }
    if (chats) {
      updateChats(global, chats)
    }
  } else {
    // combinedStore.resetState() ??
    await stopPersist()
  }
}

export async function startPersist() {
  persistStore.enable()

  const global = getGlobalState()

  const pickedState = pickPersisted(global as GlobalState)
  await Promise.all([
    storages.auth.put(pickedState.auth),
    storages.settings.put(pickedState.settings),
    storages.users.put(pickedState.users),
    storages.chats.put(pickedState.chats)
    /* i18nStorage?? */
  ])
}
