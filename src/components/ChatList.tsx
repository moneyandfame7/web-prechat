import type {FC} from 'preact/compat'

import {getGlobalState} from 'state/signal'

import {Chat} from 'containers/left/main/chats/Chat'

import './ChatList.scss'

export const ChatList: FC = () => {
  const global = getGlobalState()
  const chatIds = Object.keys(global.chats.byId)

  return (
    <div class="ChatList">
      {chatIds.map((id) => (
        <Chat chatId={id} />
      ))}
    </div>
  )
}
