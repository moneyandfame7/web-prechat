import type {ApiChat, ApiUser} from 'api/types'

import {selectIsChatWithSelf} from 'state/selectors/chats'
import {selectUser} from 'state/selectors/users'

import type {SignalGlobalState} from 'types/state'

import {getUserName} from './users'

export function getPeerName(peer: ApiUser | ApiChat) {
  if ('title' in peer) {
    return peer.title
  }

  return /*  peer.isSelf ? 'Saved Messages' : */ peer.firstName + ' ' + peer.lastName
}

export function getChatName(global: SignalGlobalState, chat: ApiChat) {
  if (selectIsChatWithSelf(global, chat.id)) {
    return 'Saved Messages'
  }

  if (chat.type === 'chatTypePrivate') {
    const user = selectUser(global, chat.id)

    return getUserName(user!)
  }

  return chat.title
}
