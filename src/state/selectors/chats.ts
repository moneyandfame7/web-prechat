import type {ApiChat} from 'api/types'

import type {SignalGlobalState} from 'types/state'

export function selectChat(global: SignalGlobalState, chatId: string): ApiChat | undefined {
  return global.chats.byId[chatId]
}

// export function select

export function selectChatsIds(global: SignalGlobalState) {
  return global.chats.ids
}

export type MakeRequired<T, K extends keyof T> = T & Required<Pick<T, K>>
export function isPrivateChat(global: SignalGlobalState, chatId: string) {
  const chat = selectChat(global, chatId)
  if (!chat) {
    return undefined
  }

  return chat.id !== chat._id && chat.type === 'chatTypePrivate' && chat.membersCount === 2
}

export function selectResolvedUsername(global: SignalGlobalState, username: string) {
  if (username[0] === '@') {
    username = username.slice(1)
  }
  username.toLowerCase()

  const id: string | undefined = global.chats.usernames[username]
  if (!id) {
    return
  }

  const chat = selectChat(global, id)

  return chat?.id
}

export function isSavedMessages(global: SignalGlobalState, chatId: string) {
  const currentId = global.auth.userId

  return currentId === chatId
}

export function selectIsChatsFetching(global: SignalGlobalState) {
  return global.chats.isLoading && selectChatsIds(global).length === 0
}

export function selectAllChats(global: SignalGlobalState) {
  return global.chats.ids.map((id) => selectChat(global, id))
}

export function selectIsChatWithSelf(global: SignalGlobalState, chatId: string) {
  return global.auth.userId === chatId
}
