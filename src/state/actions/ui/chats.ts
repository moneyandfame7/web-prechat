import {createAction} from 'state/action'
import {selectOpenedChats} from 'state/selectors/chats'
import {updateCurrentChat, updateOpenedChats} from 'state/updates'

createAction('openPreviousChat', (state) => {
  const openedChats = selectOpenedChats(state)

  const prevChat = openedChats[openedChats.length - 2]
  if (!prevChat) {
    return
  }
  updateCurrentChat(state, {
    chatId: prevChat.chatId,
    username: prevChat.username,
    isMessagesLoading: prevChat.isMessagesLoading,
  })

  // console.log({prevChat})

  updateOpenedChats(state, undefined, undefined, undefined)
})
