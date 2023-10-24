import type {ApiChat, ApiChatFull, ApiPeer} from 'api/types'

import {getChatUsername_deprecated, isPeerChat} from 'state/helpers/chats'
import {selectChat, selectCurrentChat, selectOpenedChats} from 'state/selectors/chats'
import {storages} from 'state/storages'

import {DEBUG} from 'common/environment'
import {deepCopy} from 'utilities/object/deepCopy'
import {isDeepEqual} from 'utilities/object/isDeepEqual'
import {updateByKey} from 'utilities/object/updateByKey'

import type {GlobalState, MessageEditing, OpenedChat, SignalGlobalState} from 'types/state'

import {updateUsers} from '.'
import {updateMessages} from './messages'

export function updateChats(global: SignalGlobalState, chatsById: Record<string, ApiChat>) {
  updateByKey(global.chats.byId, chatsById)
  // Object.keys(global.chats.byId).forEach(c=>{
  //   updateLastMessage(global,c)
  // })
  // Object.values(chatsById)
  const list = Object.values(global.chats.byId as Record<string, ApiChat>)
  list.forEach((c) => {
    if (c.lastMessage) {
      // console.log('CHAT MESSAGE', c.lastMessage)
      updateMessages(global, c.id, {[c.lastMessage.id]: c.lastMessage}, true)
      // updateMessages(global, c.id, {
      //   [c.lastMessage.id]: c.lastMessage,
      // })
    }
  })
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

  const updated = {
    [chatId]: chat,
  }
  storages.chats.put(updated)
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

// export function updateOpenedChats_DEPRECATED(
//   global: SignalGlobalState,
//   chatId?: string,
//   username?: string,
//   replaceHistory?: boolean,
//   isPinnedList?: boolean
// ) {
//   const openedChats = selectOpenedChats(global)

//   let newOpenedChats = openedChats
//   if (replaceHistory) {
//     newOpenedChats = chatId
//       ? [
//           {
//             chatId,
//             username,
//             isPinnedList: Boolean(isPinnedList),
//             isMessagesLoading: false,
//           },
//         ]
//       : []
//   } else if (chatId) {
//     const currentOpened = openedChats[openedChats.length - 1]
//     if (
//       !currentOpened ||
//       currentOpened.chatId !== chatId ||
//       currentOpened.username !== username ||
//       currentOpened.isPinnedList !== isPinnedList
//     ) {
//       console.log({currentOpened}, 'LIST PINNED?')
//       newOpenedChats = [
//         ...newOpenedChats,
//         {
//           chatId,
//           username,
//           isPinnedList: Boolean(isPinnedList),
//           isMessagesLoading: false,
//         },
//       ]
//     }
//   } else {
//     newOpenedChats = openedChats.slice(0, -1)
//   }
//   console.log({newOpenedChats})
//   global.openedChats = newOpenedChats
// }
export function updateOpenedChats(
  global: SignalGlobalState,
  {
    chatId,
    username,
    replaceHistory,
    isPinnedList,
  }: {
    chatId?: string
    username?: string
    replaceHistory?: boolean
    isPinnedList?: boolean
    messageEditing?: MessageEditing
  }
) {
  const openedChats = selectOpenedChats(global)

  let newOpenedChats = openedChats
  if (replaceHistory) {
    newOpenedChats = chatId
      ? [
          {
            chatId,
            username,
            isPinnedList: Boolean(isPinnedList),
            isMessagesLoading: false,
          },
        ]
      : []
  } else if (chatId) {
    const currentOpened = openedChats[openedChats.length - 1]
    if (
      !currentOpened ||
      currentOpened.chatId !== chatId ||
      currentOpened.username !== username ||
      currentOpened.isPinnedList !== isPinnedList
    ) {
      console.log({currentOpened}, 'LIST PINNED?')
      newOpenedChats = [
        ...newOpenedChats,
        {
          chatId,
          username,
          isPinnedList: Boolean(isPinnedList),
          isMessagesLoading: false,
        },
      ]
    }
  } else {
    newOpenedChats = openedChats.slice(0, -1)
  }
  console.log({newOpenedChats})
  global.openedChats = newOpenedChats
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
