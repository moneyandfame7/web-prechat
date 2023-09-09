import type {ApiChat, ApiUser} from 'api/types'

import {isPrivateChat, isSavedMessages} from 'state/selectors/chats'
import {selectUser} from 'state/selectors/users'

import type {SignalGlobalState} from 'types/state'

import {getUserName} from './users'

const USERNAME_PATTERN = /^[a-zA-Z0-9_]{5,}$/

export function getPeerName(peer: ApiUser | ApiChat) {
  if ('title' in peer) {
    return peer.title
  }

  return /*  peer.isSelf ? 'Saved Messages' : */ peer.firstName + ' ' + peer.lastName
}

export function getChatName(global: SignalGlobalState, chat: ApiChat) {
  if (isSavedMessages(global, chat.id)) {
    return 'Saved Messages'
  }

  if (isPrivateChat(global, chat.id)) {
    const user = selectUser(global, chat.id)

    return user ? getUserName(user) : 'NOT DEFINED USER'
  }

  return chat.title
}

export function isValidUsername(username: string) {
  return USERNAME_PATTERN.test(username)
}
