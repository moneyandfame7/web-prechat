import {selectChat} from 'state/selectors/chats'
import {createSubscribe} from 'state/subscribe'
import {updateChat, updateChats} from 'state/updates'
import {updateMessages} from 'state/updates/messages'

createSubscribe('onNewMessage', (state, actions, data) => {
  const {chat, message} = data
  if (message.isOutgoing) {
    console.log('Message subscribe outgoing. ( check on other sessions? )')
    return
  }
  const exist = selectChat(state, chat.id)
  if (!exist) {
    updateChats(state, {[chat.id]: chat})
  } else {
    updateChat(state, chat.id, {
      unreadCount: exist.unreadCount ? exist.unreadCount + 1 : 1, // or just chat.unreadCount?
      lastMessage: message,
    })
  }

  updateMessages(state, chat.id, {
    [message.id]: message,
  })
})
