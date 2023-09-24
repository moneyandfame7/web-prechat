import type {DeepSignal} from 'deepsignal'

import type {ApiMessage} from 'api/types/messages'

import {createPersistStore} from 'state/persist'
import type {PersistIdbStorage, Storages, StoragesName} from 'state/persist/types'

import {DEBUG} from 'common/environment'
import {pick} from 'utilities/object/pick'
import {updateByKey} from 'utilities/object/updateByKey'

import type {GlobalState} from 'types/state'

import {INITIAL_STATE} from './initState'
import {getGlobalState} from './signal'
import {updateAuthState, updateSessions, updateSettingsState, updateUsers} from './updates'
import {updateChats, updateChatsFull} from './updates/chats'
import {updateMessages} from './updates/messages'

/**
 * @todo додати обробку pick state
 */
const persistStore = createPersistStore({
  databaseName: 'prechat-state',
  version: 1,
  storages: [
    {name: 'auth'},
    {name: 'settings'},
    {name: 'chats', optionalParameters: {keyPath: 'id'}},
    {name: 'sessions', optionalParameters: {keyPath: 'id'}},
    {name: 'messages', optionalParameters: {keyPath: 'id'}},
    {name: 'users', optionalParameters: {keyPath: 'id'}},
    {name: 'usernames'},
    {name: 'chatsFull'},
    {name: 'i18n'},
  ],
})
export function pickPersistMessages(state: GlobalState) {
  const messages = {} as Record<string, ApiMessage>
  Object.values(state.messages.byChatId).forEach((chatMessages) => {
    Object.values(chatMessages.byId).forEach((message) => {
      messages[message.id] = message
    })
  })

  return messages
}
export function pickFromPersistedMessages(
  messages: Record<string, ApiMessage>
): GlobalState['messages']['byChatId'] {
  const messagesByChatId: Record<string, {byId: Record<string, ApiMessage>}> = {}

  Object.values(messages).forEach((message) => {
    const chatId = message.chatId

    if (!messagesByChatId[chatId]) {
      messagesByChatId[chatId] = {
        byId: {},
      }
    }
    messagesByChatId[chatId].byId[message.id] = message
  })
  return messagesByChatId
}
export const storages = {
  auth: persistStore.injectStorage('auth'),
  settings: persistStore.injectStorage('settings'),
  users: persistStore.injectStorage('users'),
  chats: persistStore.injectStorage('chats'),
  usernames: persistStore.injectStorage('usernames'),
  i18n: persistStore.injectStorage('i18n'),
  sessions: persistStore.injectStorage('sessions'),
  chatsFull: persistStore.injectStorage('chatsFull'),
  messages: persistStore.injectStorage('messages'),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
} satisfies Record<StoragesName, PersistIdbStorage<any>>

const PERSIST_DISABLED = false

function pickPersisted(state: GlobalState): Omit<Storages, 'i18n' | 'usernames'> {
  const messages = pickPersistMessages(state)

  return {
    auth: pick(state.auth, ['userId', 'session', 'phoneNumber', 'rememberMe']),
    users: state.users.byId,
    chats: state.chats.byId,
    chatsFull: state.chats.fullById,
    // usernames: state.chats.usernames,
    settings: state.settings,
    sessions: state.activeSessions.byId,
    messages,
    // i18n: {
    //   [state.settings.i18n.lang_code]: state.settings.i18n.pack,
    // },
  }
}

async function clearStorage() {
  await Promise.all(
    Object.keys(storages).map((storage) => storages[storage as keyof typeof storages].clear())
  )
}
// Object.keys(storages).map((s) => storages[s as keyof typeof storages].get())
async function readStorage() {
  const [auth, settings, users, chats, messages, usernames, chatsFull, sessions] =
    await Promise.all([
      storages.auth.get(),
      storages.settings.get(),
      storages.users.get(),
      storages.chats.get(),
      storages.messages.get(),
      storages.usernames.get(),
      storages.chatsFull.get(),
      storages.sessions.get(),
    ])

  return {auth, settings, users, usernames, chats, messages, chatsFull, sessions}
}

export async function stopPersist() {
  persistStore.disable()
  await clearStorage() // ?
  // rootStore2.set
}

export async function hydrateStore() {
  // eslint-disable-next-line no-console
  console.time('HYDRATE')

  if (PERSIST_DISABLED) {
    if (DEBUG) {
      // eslint-disable-next-line no-console
      console.error('PERSIST DISABLED IN const VARIABLE')
    }

    return
  }
  const {auth, settings, chats, users, sessions, chatsFull, usernames, messages} =
    await readStorage()

  const global = getGlobalState()
  if (auth?.session || settings?.passcode.hasPasscode) {
    // MOVE TO "setGlobalState"
    if (auth) {
      updateAuthState(global, {
        ...global.auth,
        ...auth,
      } as DeepSignal<any>)
    }
    if (settings) {
      console.log({settings})
      updateSettingsState(global, {
        ...global.settings,
        ...settings,
        general: {
          ...global.settings.general,
          ...settings.general,
          animations: {
            ...global.settings.general.animations,
            ...settings.general.animations,
          },
        },
      })
    }
    if (users) {
      updateUsers(global, users)
    }
    if (usernames) {
      updateByKey(global.chats.usernames, usernames)
    }
    if (chats) {
      updateChats(global, chats)
    }
    if (messages) {
      const byChatId = pickFromPersistedMessages(messages)
      Object.keys(byChatId).forEach((chatId) => {
        updateMessages(global, chatId, byChatId[chatId].byId)
      })
    }
    if (chatsFull) {
      updateChatsFull(global, chatsFull)
    }
    if (sessions) {
      updateSessions(global, sessions)
    }

    persistStore.enable()
    if (!settings) {
      storages.settings.put(INITIAL_STATE.settings)
    }
    // for sync storage??
    // /* await */ forcePersist(global as GlobalState)
  } else {
    // combinedStore.resetState() ??
    await stopPersist()
  }

  // eslint-disable-next-line no-console
  console.timeEnd('HYDRATE')
}

/**
 * @todo передавати global просто всередину?
 */
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
    storages.sessions.put(pickedForPersist.sessions),
    // storages.usernames.put(pickedForPersist.usernames),
    storages.messages.put(pickedForPersist.messages),
    // storages.i18n.put(pickedForPersist.i1n),
    /* i18nStorage?? */
  ])
}
