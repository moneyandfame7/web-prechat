import type {ApiChat, ApiPeer} from 'api/types'

import {selectChat} from 'state/selectors/chats'
import {storages} from 'state/storages'

import {DEBUG} from 'common/config'
import {updateByKey} from 'utilities/object/updateByKey'

import type {SignalGlobalState} from 'types/state'

export function updateChats(global: SignalGlobalState, chatsById: Record<string, ApiChat>) {
  updateByKey(global.chats.byId, chatsById)

  const list = Object.values(global.chats.byId as Record<string, ApiChat>)
  const orderedIds = list
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .map((s) => s.id)

  global.chats.ids = [...orderedIds]

  updateUsernames(global, list)
  storages.chats.put(chatsById)
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

export function updateUsernames(global: SignalGlobalState, peers: ApiPeer[]) {
  const usernames = global.chats.usernames
  const usernamePredicate = (p: ApiPeer) => {
    const username = getPeerUsername(p)

    return typeof username !== 'undefined' && !usernames?.[username]
  }
  const filteredAndUpdated = peers.filter(usernamePredicate).reduce((acc, p) => {
    const username = getPeerUsername(p)

    if (username) {
      acc[username] = p.id
    }
    return acc
  }, {} as Record<string, string>)

  global.chats.usernames = {...filteredAndUpdated} as SignalGlobalState['chats']['usernames']
}

export function getPeerUsername(p: ApiPeer) {
  return 'username' in p ? p.username : 'title' in p ? p.title : undefined
}
