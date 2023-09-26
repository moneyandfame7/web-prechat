import type {DeepSignal} from 'deepsignal'

import {apiManager} from 'api/api-manager'
import {Api} from 'api/manager'
import {
  type ApiDraft,
  type ApiInputSaveDraft,
  type ApiMessage,
  HistoryDirection,
} from 'api/types'

import {createAction} from 'state/action'
import {buildLocalPrivateChat} from 'state/helpers/chats'
import {buildLocalMessage, orderHistory} from 'state/helpers/messages'
import {isUserId} from 'state/helpers/users'
import {selectChat} from 'state/selectors/chats'
import {selectMessages} from 'state/selectors/messages'
import {selectUser} from 'state/selectors/users'
import {updateChat, updateChats} from 'state/updates'
import {deleteDraft, updateDraft, updateMessage, updateMessages} from 'state/updates/messages'

import {debounce} from 'common/functions'
import {filterUnique} from 'utilities/array/filterUnique'
import {buildRecord} from 'utilities/object/buildRecord'
import {updateByKey} from 'utilities/object/updateByKey'

import type {SignalGlobalState} from 'types/state'

const debouncedSaveDraft = debounce(saveDraft, 4000, false)

createAction('sendMessage', async (state, _, payload) => {
  const {currentChat} = state

  if (!currentChat.chatId) {
    return
  }
  const {chatId} = currentChat
  let chat = selectChat(state, chatId)
  // if (!chat) {
  //   return
  // }
  const {text, entities, sendAs} = payload
  if (!chat && isUserId(chatId)) {
    chat = buildLocalPrivateChat({user: selectUser(state, chatId)!})
    updateChats(state, {
      [chat.id]: chat,
    })
  } else if (!chat) {
    return
  }
  const localMessage = buildLocalMessage({
    chatId,
    text,
    entities,
    senderId: sendAs || state.auth.userId!,
    isChannel: chat.type === 'chatTypeChannel',
  })
  // updateLastMessage(state, chatId, localMessage, false)
  console.log({localMessage})
  updateMessages(state, chatId, {[localMessage.id]: localMessage}, false, false)
  updateChat(state, chatId, {
    lastMessage: localMessage,
  })
  // after 1s need to set state status on pending?
  /* Catch error there and update message state */
  const sended = await Api.messages.sendMessage({
    id: localMessage.id,
    chatId,
    text,
    entities,
  })

  if (!sended) {
    /* should delete local message? */
    return
  }

  updateMessage(state, chatId, sended.message.id, {sendingStatus: undefined}, false)

  // const {message} = sended
  // updateMessage(state, chatId, builded.id, {
  //   content: {
  //     formattedText: {
  //       text: 'TI EBLAN YA HZ YAK ЦЕ ВИПРАВЛЯТИ!',
  //     },
  //   },
  // })
  // deleteMessage(state, chatId, builded.id)
  // replaceLocalMessage(state, chatId, localMessage, sended.message)

  // console.log({builded})
  // deleteMessage(state, chatId, builded.id)

  // updateMessages(state, chatId, {
  //   [message.id]: message,
  // })
  // updateMessage(state, chatId, builded.id, {
  //   id: message.id,
  //   createdAt: message.createdAt,
  //   sendingState: undefined,
  // })
})

createAction('getHistory', async (state, _actions, payload) => {
  const {
    chatId,
    direction = HistoryDirection.Backwards,
    limit = 10,
    maxDate,
    offsetId,
    includeOffset = false,
  } = payload
  const chat = selectChat(state, chatId)
  if (!chat) {
    return
  }

  // currentOpenedChat.isMessagesLoading = true

  const result = await Api.messages.getHistory({
    direction,
    chatId,
    offsetId,
    limit,
    maxDate,
    includeOffset,
  })
  const oldMessages = selectMessages(state, chatId)
  // const newMessages = result.map((m, idx) => ({
  //   id: m.id,
  //   idx,
  //   text: m.content.formattedText?.text,
  // }))
  const merged = [...Object.values(oldMessages || []), ...Object.values(result)]

  const orderedHistory = orderHistory(merged)
  // const merged=[oldMessages?(...Object.values(oldMessages))]
  // console.log(Object.values(oldMessages))
  // const newMessages = result.map((m) => m.id)
  // console.log({
  //   merged: merged.map((m) => m.id),
  //   ids: orderedHistory.map((m) => m.id),
  // })
  const orderedIds = filterUnique(orderedHistory.map((m) => m.id))

  /* Avoid to recreate???? */
  if (
    oldMessages &&
    Object.keys(result).every((newId) => Boolean(oldMessages[String(newId)]))
  ) {
    return
  }
  const record = buildRecord(result, 'id') as DeepSignal<Record<string, ApiMessage>>
  if (!oldMessages) {
    state.messages.byChatId[chatId] = {
      byId: record,
    }
  } else {
    updateByKey(oldMessages, record)
  }
  state.messages.idsByChatId[chatId] = [...orderedIds]

  console.log({orderedIds})
  // console.log(
  //   merged.map((m) => m.id),
  //   ids
  // )
  // console.log(filterUnique([...newMessages, ...(oldMessages || [])]))

  // currentOpenedChat.isMessagesLoading = false
  // console.log()
  // updateMessages(state, currentOpenedChat.chatId, buildRecord(result, 'id'))

  // const {chatId, limit, offset} = payload

  // await Api.messages.getMessages(payload)
  // const ids=
})

createAction('saveDraft', async (state, _actions, payload) => {
  const {force, ...input} = payload
  const chat = selectChat(state, input.chatId)
  if (!chat) {
    return
  }
  const processedInput = {
    ...input,
    date: new Date(),
  }
  if (force) {
    return saveDraft(state, processedInput)
  }

  debouncedSaveDraft(state, processedInput)
})

async function saveDraft(state: SignalGlobalState, input: ApiInputSaveDraft) {
  const draft = {
    date: new Date(),
    formattedText: {
      text: input.text,
      entities: input.entities,
    },
    replyToMsgId: input.replyToMsgId,
    isLocal: true,
  }
  const result = await apiManager.invokeApi({
    method: 'messages.saveDraft',
    variables: {
      input: {
        ...input,
        date: new Date(),
      },
    },
  })
  if (result) {
    draft.isLocal = false
  }
  if (!input.text) {
    deleteDraft(state, input.chatId)
  } else {
    updateDraft(state, input.chatId, draft as ApiDraft)
  }
}
