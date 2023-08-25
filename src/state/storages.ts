import type {ApiLangCode, ApiLangPack} from 'api/types'
import type {ApiChat} from 'api/types/chats'
import type {ApiUser} from 'api/types/users'

import {createPersistStore} from 'state/persist'
import type {PersistIdbStorage, StoragesName} from 'state/persist/types'

import {DEBUG} from 'common/config'
import {pick} from 'utilities/object/pick'

import type {AuthState, GlobalState, SettingsState} from 'types/state'

import {getGlobalState} from './signal'
import {updateAuthState, updateSettingsState, updateUsers} from './updates'
import {updateChats} from './updates/chats'

const persistStore = createPersistStore({
  databaseName: 'prechat-state',
  version: 1,
  storages: [
    {
      name: 'auth',
    },
    {
      name: 'settings',
    },
    {
      name: 'chats',
      optionalParameters: {
        keyPath: 'id',
      },
    },
    {
      name: 'users',
      optionalParameters: {
        keyPath: 'id',
      },
    },
    {
      name: 'i18n',
    },
  ],
})

export const storages = {
  auth: persistStore.injectStorage<AuthState>({storageName: 'auth'}),
  settings: persistStore.injectStorage<SettingsState>({storageName: 'settings'}),
  users: persistStore.injectStorage<Record<string, ApiUser>>({storageName: 'users'}),
  chats: persistStore.injectStorage<Record<string, ApiChat>>({storageName: 'chats'}),
  i18n: persistStore.injectStorage<Record<ApiLangCode, ApiLangPack>>({
    storageName: 'i18n',
  }),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
} satisfies Record<StoragesName, PersistIdbStorage<any>>

const PERSIST_DISABLED = false

function pickPersisted(state: GlobalState) {
  return {
    auth: pick(state.auth, ['userId', 'session', 'phoneNumber', 'rememberMe']),
    users: state.users.byId,
    chats: state.chats.byId,
    settings: state.settings,
    // i18n: state.settings.i18n,
  }
}

async function clearStorage() {
  await Promise.all(
    Object.keys(storages).map((storage) => storages[storage as keyof typeof storages].clear())
  )
}

async function readStorage() {
  const [auth, settings, users, chats] = await Promise.all([
    storages.auth.get(),
    storages.settings.get(),
    storages.users.get(),
    storages.chats.get(),
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
    // MOVE TO "setGlobalState"
    if (auth) {
      updateAuthState(global, auth)
    }
    if (settings) {
      updateSettingsState(global, settings)
    }
    if (users) {
      updateUsers(global, users)
    }
    if (chats) {
      updateChats(global, chats)
    }

    persistStore.enable()

    // for sync storage??
    // /* await */ forcePersist(global as GlobalState)
  } else {
    // combinedStore.resetState() ??
    await stopPersist()
  }
}

export async function startPersist() {
  persistStore.enable()
  const global = getGlobalState()

  await forcePersist(global as GlobalState)
}

export async function forcePersist(global: GlobalState) {
  const pickedForPersist = pickPersisted(global)

  await Promise.all([
    storages.auth.put(pickedForPersist.auth),
    storages.settings.put(pickedForPersist.settings),
    storages.users.put(pickedForPersist.users),
    storages.chats.put(pickedForPersist.chats),
    // storages.i18n.put(pickedForPersist.i1n),
    /* i18nStorage?? */
  ])
}
