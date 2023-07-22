import type {FC} from 'preact/compat'

import {ChatItem, type ChatItemProps} from './ChatItem'

import './ChatList.scss'

interface ChatListProps {
  items: ChatItemProps[]
}

export const ChatList: FC<ChatListProps> = ({items}) => {
  return (
    <div class="ChatList">
      {items.map((item) => (
        <ChatItem {...item} />
      ))}
    </div>
  )
}
