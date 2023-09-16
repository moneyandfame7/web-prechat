import type {ApiChat, ApiChatFull, ApiPeer} from 'api/types'

import {getChatUsername_deprecated, isPeerChat} from 'state/helpers/chats'
import {selectChat} from 'state/selectors/chats'
import {storages} from 'state/storages'

import {DEBUG} from 'common/config'
import {deepCopy} from 'utilities/object/deepCopy'
import {isDeepEqual} from 'utilities/object/isDeepEqual'
import {updateByKey} from 'utilities/object/updateByKey'

import type {GlobalState, SignalGlobalState} from 'types/state'

import {updateUsers} from '.'

export function updateChats(global: SignalGlobalState, chatsById: Record<string, ApiChat>) {
  updateByKey(global.chats.byId, chatsById)

  // Object.values(chatsById)
  const list = Object.values(global.chats.byId as Record<string, ApiChat>)

  const orderedIds = list
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .map((s) => s.id)

  global.chats.ids = [...orderedIds]

  updateUsernamesFromPeers(global, list)

  storages.chats.put(chatsById)
}

export function replacePeer(global: SignalGlobalState, peer: ApiPeer) {
  const isChat = isPeerChat(peer)
  if (isChat) {
    updateChats(global, {
      [peer.id]: peer,
    })
  } else {
    updateUsers(global, {
      [peer.id]: peer,
    })
  }
}

export function updateChat(
  global: SignalGlobalState,
  chatId: string,
  chatToUpd: Partial<ApiChat>
) {
  const chat = selectChat(global, chatId)

  if (!chat) {
    if (DEBUG) {
      // eslint-disable-next-line no-console
      console.warn(`CHAT ${chatId} to update not found`)
    }
    return
  }

  updateByKey(chat, chatToUpd)

  storages.chats.put({
    // just put chat? we already update him...
    [chatId]: {
      ...chat,
      ...chatToUpd,
    },
  })
}

export function updateChatsFull(
  global: SignalGlobalState,
  fullById: Record<string, ApiChatFull>
) {
  updateByKey(global.chats.fullById, fullById)

  storages.chatsFull.put(fullById)
}

export function updateChatFullInfo(
  global: SignalGlobalState,
  chatId: string,
  fullInfo: ApiChatFull
) {
  const existFull = global.chats.fullById[chatId]

  if (isDeepEqual(existFull, fullInfo)) {
    return
  }

  const newObj = deepCopy({...existFull, ...fullInfo})

  global.chats.fullById[chatId] = newObj
  storages.chatsFull.put({
    [chatId]: newObj,
  })
}

export function updateCurrentChat(
  global: SignalGlobalState,
  toUpd: Partial<GlobalState['currentChat']>
) {
  updateByKey(global.currentChat, toUpd)
}

export function updateUsernamesFromPeers(global: SignalGlobalState, peers: ApiPeer[]) {
  const usernames = global.chats.usernames
  const usernamePredicate = (p: ApiPeer) => {
    const username = getChatUsername_deprecated(p)

    return username !== undefined && !usernames?.[username]
  }
  const filteredAndUpdated = peers.filter(usernamePredicate).reduce((acc, p) => {
    const username = getChatUsername_deprecated(p)

    if (username) {
      acc[username] = p.id
    }
    return acc
  }, {} as Record<string, string>)

  global.chats.usernames = {
    ...usernames,
    ...filteredAndUpdated,
  } as SignalGlobalState['chats']['usernames']
}
