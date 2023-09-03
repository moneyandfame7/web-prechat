import {createSubscribe} from 'state/subscribe'
import {updateUsers} from 'state/updates'
import {updateChats} from 'state/updates/chats'

import {buildRecord} from 'utilities/object/buildRecord'

createSubscribe('onChatCreated', (state, _, data) => {
  const {chat, users} = data
  console.log('NEW CHAT >>>>>>>>>>>><<<<<<<<:', chat, users)

  updateChats(state, {
    [chat.id]: chat,
  })

  updateUsers(state, buildRecord(users, 'id'))
})
