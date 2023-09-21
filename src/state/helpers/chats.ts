import type {ApiChat, ApiPeer, ApiUser} from 'api/types'

import {type MakeRequired, isSavedMessages} from 'state/selectors/chats'
import {selectUser} from 'state/selectors/users'

import {USE_USERNAMES} from 'common/environment'

import type {SignalGlobalState} from 'types/state'

import {getUserName, isUserId} from './users'

const USERNAME_PATTERN = /^[a-zA-Z0-9_]{5,}$/

export function buildLocalPrivateChat({user}: {user: ApiUser}): ApiChat {
  return {
    id: user.id,
    _id: crypto.randomUUID(),
    color: user.color,
    createdAt: new Date().toISOString() as any,
    isOwner: false,
    title: getUserName(user),
    type: 'chatTypePrivate',
    userId: user.id,
    isSavedMessages: false,
    unreadCount: 0,
  }
}
export function getPeerName(peer: ApiUser | ApiChat) {
  if ('title' in peer) {
    return peer.title
  }

  return /*  peer.isSelf ? 'Saved Messages' : */ peer.firstName + ' ' + peer.lastName
}

export function getChatName_deprecated(global: SignalGlobalState, chat: ApiChat) {
  if (isSavedMessages(global, chat.id)) {
    return 'Saved Messages'
  }

  if (isPrivateChat2(chat)) {
    const user = selectUser(global, chat.id)

    return user ? getUserName(user) : 'NOT DEFINED USER'
  }

  return chat.title
}
export function getChatName(chat: ApiChat, isSaved?: boolean) {
  if (isSaved) {
    return 'Saved Messages _TRANSLATE'
  }

  return chat.title
}

export function getChatUsername(global: SignalGlobalState, chat: ApiChat) {
  const isPrivate = isUserId(chat.id)

  if (isPrivate) {
    const user = selectUser(global, chat.id)

    return user?.username ? `@${user.username}` : undefined
  }

  return chat.inviteLink ? chat.inviteLink?.split('p.me/')?.[1] : undefined
}

export function getChatUsername_deprecated(peer?: ApiChat | ApiUser) {
  if (!peer) {
    return
  }

  if ('firstName' in peer) {
    return peer.username
  }
  if ('inviteLink' in peer) {
    return peer.inviteLink?.split('p.me/')?.[1]
  }
}

export function getChatRoute(peer?: ApiChat | ApiUser) {
  if (!peer) {
    return undefined
  }
  const chatUsername = getChatUsername_deprecated(peer)

  if (chatUsername && USE_USERNAMES) {
    return `http://localhost:8000/#@${chatUsername.toLowerCase()}`
  }

  return `http://localhost:8000/#${peer.id}`
}

export function isPrivateChat2(chat: ApiChat): chat is MakeRequired<ApiChat, 'userId'> {
  return chat.type === 'chatTypePrivate' && Boolean(chat.userId)
}

export function isChatId(id: string) {
  return id.startsWith('c_')
}

export function isPeerChat(peer: ApiPeer): peer is ApiChat {
  return 'title' in peer
}
export function isPeerUser(peer: ApiPeer): peer is ApiUser {
  return 'username' in peer
}

export function isValidUsername(username: string) {
  return USERNAME_PATTERN.test(username)
}
