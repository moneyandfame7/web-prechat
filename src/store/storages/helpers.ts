import {combinedStore} from 'store/combined'

import {logDebugError} from 'lib/logger'
import {authStorage} from './auth.storage'
import {chatsStorage} from './chats.storage'
import {settingsStorage} from './settings.storage'
import {usersStorage} from './users.storage'
import {persistStore} from './persist'

const PERSIST_DISABLED = false

export async function clearStorage() {
  await Promise.all([
    authStorage.clear(),
    settingsStorage.clear(),
    usersStorage.clear(),
    chatsStorage.clear()
  ])
}

export async function readStorage() {
  const [auth, settings, users, chats] = await Promise.all([
    authStorage.get(),
    settingsStorage.get(),
    usersStorage.get(),
    chatsStorage.get()
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
    logDebugError('persist disabled by const')

    return
  }
  const {auth, settings, chats, users} = await readStorage()

  if (auth?.session || settings?.passcode.hasPasscode) {
    persistStore.enable()

    combinedStore.setState({
      ...(auth ? {auth} : {}),
      ...(settings ? {settings} : {}),
      ...(chats ? {chats: {byId: chats}} : {}),
      ...(users ? {users: {byId: users}} : {})
    })
  } else {
    combinedStore.resetState()
    await stopPersist()
  }
}

export async function startPersist() {
  persistStore.enable()

  const state = combinedStore.getState()

  await Promise.all([
    authStorage.put(state.auth),
    settingsStorage.put(state.settings),
    usersStorage.put(state.users.byId),
    chatsStorage.put(state.chats.byId)
    /* i18nStorage?? */
  ])
}
