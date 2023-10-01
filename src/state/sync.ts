import type {DeepSignal} from 'deepsignal'

import type {SyncedState} from 'types/state'

import {getGlobalState} from './signal'

// interface IBroadcastChannel{
//   addEventListener:()
// }
function isSupported() {
  return 'BroadcastChannel' in globalThis
}
const channel = new BroadcastChannel('syncState')
// channel.
function handleMessage(ev: MessageEvent<DeepSignal<SyncedState>>) {
  const global = getGlobalState()

  const newTheme = ev.data.settings.general?.theme
  console.log('NEW THEME:', newTheme)

  // global.settings.general.theme = ev.data.settings.general?.theme || 'system'
  const {
    data: {activeSessions, chats, auth, emojis, messages, settings, users},
  } = ev
  // if (activeSessions) {
  //   global.activeSessions = {
  //     ...activeSessions,
  //   }
  // }
  // if (chats) {
  //   const hasChatsFull = !!chats.fullById && Object.keys(chats.fullById).length > 0
  //   const hasChats = !!chats.byId && Object.keys(chats.byId).length > 0
  //   const hashUsernames = !!chats.usernames && Object.keys(chats.usernames).length > 0
  //   if (hasChatsFull) {
  //     updateChatsFull(global, chats.fullById!)
  //   }
  //   if (hasChats) {
  //     updateChats(global, chats.byId!)
  //   }
  //   if (hashUsernames) {
  //     updateByKey(global.chats, chats.usernames!)
  //   }
  //   if (chats.ids) {
  //     global.chats.ids = [...chats.ids]
  //   }
  // }
  // if (auth) {
  //   updateByKey(global.auth, auth)
  // }

  // if (settings) {
  //   updateSettingsState(global, settings, false, false)
  // }
  if (emojis) {
    global.emojis = {
      ...emojis,
    }
  }
  // if (messages) {
  //   // messages
  //   const hasChatMessages = !!messages.byChatId && Object.keys(messages.byChatId).length > 0
  //   const hasChatMessageIds =
  //     !!messages.idsByChatId && Object.keys(messages.idsByChatId).length > 0
  //   if (hasChatMessages) {
  //     Object.keys(messages.byChatId!).forEach((chatId) => {
  //       const messagesById = messages.byChatId![chatId]?.byId

  //       updateMessages(global, chatId, messagesById, false, false)
  //     })
  //   }
  //   // if (hasChatMessageIds) {
  //   //   addMessagesIds(global)
  //   // }
  //   // const hasMessages=Object.keys(messages.)
  // }

  // console.log('NEW MESSAGE: ', ev.data)
  // console.log()
}
export function subscribeToSyncUpdate() {
  if (isSupported()) {
    channel.addEventListener('message', handleMessage)
  }
}
export function unsubscribeFromSyncUpdate() {
  channel.removeEventListener('message', handleMessage)
}
export function updateSyncState(state: Partial<SyncedState>) {
  channel.postMessage(state)
}
