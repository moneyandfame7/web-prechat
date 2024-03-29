import {user} from 'assets/icons/all'

import type {ApiChat, ApiChatFull, ApiChatMember} from 'api/types'
import type {ApiChatId} from 'api/types/diff'

import {getChatUsername_deprecated, isPrivateChat2} from 'state/helpers/chats'
import {isUserId} from 'state/helpers/users'

import type {OpenChats, SignalGlobalState} from 'types/state'

import {isUserOnline, selectUser} from './users'

export function selectChat(global: SignalGlobalState, chatId: string): ApiChat | undefined {
  return global.chats.byId[chatId]
}

export function selectChatMember(
  global: SignalGlobalState,
  chatId: string,
  userId: string
): ApiChatMember | undefined {
  const chatFull = selectChatFull(global, chatId)
  if (!chatFull) {
    return
  }

  return chatFull.members?.find((member) => member.userId === userId)
}

// export function select

export function selectChatsIds(global: SignalGlobalState) {
  return global.chats.ids
}

export type MakeRequired<T, K extends keyof T> = T & Required<Pick<T, K>>

/**
 *  *chat._id - its prisma generated uuid, chat.id - its peer id (user, or chat)
 */
export function selectIsPrivateChat(global: SignalGlobalState, chatId: string) {
  const chat = selectChat(global, chatId)
  if (!chat) {
    return undefined
  }
  // const isSaved = isSavedMessages(global, chatId)
  return (
    // isSaved ||
    isPrivateChat2(chat)
  )
}

export function selectIsChannel(global: SignalGlobalState, chatId: string) {
  const chat = selectChat(global, chatId)
  if (!chat) {
    return undefined
  }

  return isChatChannel(chat)
  // c
}
// export function isPrivateChat(global:SignalGlobalState,peer:ApiPeer){
//   const isSaved=peer.id===global.auth.userId
//   return isSaved|| 'title' in peer && peer.id!==peer._id
// }

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

export function selectChatByUsername(global: SignalGlobalState, username: string) {
  const id: ApiChatId | undefined = global.chats.usernames[username]

  if (!id) {
    return
  }

  /**
   * @todo rewrite, because may return only chat, but need user also
   */
  return selectChat(global, id)
}

export function selectUsername(global: SignalGlobalState, username: string) {
  return global.chats.usernames[username]
}
// export function isPrivateChat2(chat)
/**
 * @todo мб просто в чаті залишати userId?
 */
export function selectUsernameByChatId(global: SignalGlobalState, chatId: string) {
  const chat = selectChat(global, chatId)
  if (!chat) {
    return undefined
  }
  const isPrivate = isPrivateChat2(chat)
  if (isPrivate) {
    return selectUser(global, chat.userId)?.username
  }
  /* хуйня ідея, потім переробити? */
  return getChatUsername_deprecated(chat)
}

export function selectCurrentChat_deprecated(global: SignalGlobalState): ApiChat | undefined {
  const currentChatId = global.currentChat.chatId
  return currentChatId ? global.chats.byId[currentChatId] : undefined
}

export function selectOpenedChats(global: SignalGlobalState): OpenChats[] {
  return global.openChats
}
export function selectCurrentChat(global: SignalGlobalState): OpenChats | undefined {
  return global.openChats[global.openChats.length - 1]
}

export function isSavedMessages(global: SignalGlobalState, chatId: string) {
  const currentId = global.auth.userId

  return currentId === chatId
}

export function isChatChannel(chat: ApiChat) {
  return chat.type === 'chatTypeChannel'
}

export function isChatGroup(chat: ApiChat) {
  return chat.type === 'chatTypeGroup'
}

export function selectIsChatsFetching(global: SignalGlobalState) {
  return (
    (global.isChatsFetching && selectChatsIds(global).length === 0) ||
    (global.isContactsFetching && global.users.contactIds.length === 0)
  )
}

export function selectIsMessagesLoading(global: SignalGlobalState) {
  return selectCurrentChat(global)?.isMessagesLoading
}

export function selectAllChats(global: SignalGlobalState) {
  return global.chats.ids.map((id) => selectChat(global, id))
}

export function selectIsChatWithSelf(global: SignalGlobalState, chatId: string) {
  return global.auth.userId === chatId
}

export function selectChatFull(
  global: SignalGlobalState,
  chatId: string
): ApiChatFull | undefined {
  return global.chats.fullById[chatId]
}

export function selectCanEditChat(global: SignalGlobalState, chatId: string) {
  const myId = global.auth.userId!

  const isSaved = isSavedMessages(global, chatId)
  const isPrivate = isUserId(chatId)
  /** якщо це юзер, то full info не буде */
  const full = selectChatFull(global, chatId)
  const member = full ? getChatMember(full, myId) : undefined

  return (
    (!isSaved && isPrivate) ||
    (!isPrivate &&
      (member?.isOwner || member?.isAdmin)) /* && member?.adminPermissions?.canChangeInfo */
  )
}

export function selectCanAddToContact(global: SignalGlobalState, chatId: string) {
  const user = isUserId(chatId) ? selectUser(global, chatId) : undefined

  if (!user) {
    return
  }

  return !user.isContact
}

export function getChatMember(chatFull: ApiChatFull, userId: string) {
  return chatFull.members?.find((m) => m.userId === userId)
}
export function getChatMemberIds(chatFull: ApiChatFull) {
  return chatFull.members?.map((m) => m.userId)
}
// export function getChatMembers(chatFull:ApiChatFull){
//   return chatFull.members
// }
// export function selectChatMember(global: SignalGlobalState, chatId: string, userId: string) {}

export function selectOnlineCount(global: SignalGlobalState, chatFull: ApiChatFull) {
  if (!chatFull.members || chatFull.members.length === 0) {
    return 0 // Немає учасників, повертаємо 0
  }

  const onlineCount = chatFull.members.reduce((count, member) => {
    const user = selectUser(global, member.userId)

    if (user /* && !user.isSelf */ && isUserOnline(user)) {
      return count + 1
    }

    return count
  }, 0)

  return onlineCount
}
