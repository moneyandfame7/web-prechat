import {Api} from 'api/manager'
import type {ApiChat, CreateChannelInput, CreateGroupInput} from 'api/types'

import {createStore} from 'lib/store'
import {buildRecord} from 'utilities/object/buildRecord'
import {deepUpdate} from 'utilities/object/deepUpdate'

interface ChatsState {
  byId: Record<string, ApiChat>
}

const initialState: ChatsState = {
  byId: {}
}

export const chatsStore = createStore({
  initialState,
  name: 'chatsStore',
  actionHandlers: {
    createChannel: async (state, payload: CreateChannelInput) => {
      const createdChannel = await Api.chats.createChannel(payload)

      if (!createdChannel) {
        return
      }

      deepUpdate(state.byId, {
        [createdChannel.id]: createdChannel
      })
    },
    createGroup: async (state, payload: CreateGroupInput) => {
      const createdGroup = await Api.chats.createGroup(payload)

      if (!createdGroup) {
        return
      }
      deepUpdate(state.byId, {
        [createdGroup.id]: createdGroup
      })
    },
    getChats: async (state) => {
      const chats = await Api.chats.getChats()

      if (!chats) {
        return
      }
      const record = buildRecord(chats, 'id')

      deepUpdate(state.byId, record)
    }
  }
})
