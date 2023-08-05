import {createSubscribe} from 'state/subscribe'
import {updateUsers} from 'state/updates'
import {updateChats} from 'state/updates/chats'
import {buildRecord} from 'utilities/object/buildRecord'

createSubscribe('onChatCreated', (state, _, data) => {
  // console.log('NEW CHAT:', data)

  const {chat, users} = data
  updateChats(state, {
    [chat.id]: chat
  })

  updateUsers(state, buildRecord(users, 'id'))
})
