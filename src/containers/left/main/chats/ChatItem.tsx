import type {FC} from 'preact/compat'

import {selectChat} from 'state/selectors/chats'
import {getGlobalState} from 'state/signal'

import {AvatarTest} from 'components/ui/AvatarTest'
import {ListItem} from 'components/ui/ListItem'

import './ChatItem.scss'

interface ChatItemProps {
  chatId: string
}
const ChatItem: FC<ChatItemProps> = ({chatId}) => {
  const global = getGlobalState()
  const chat = selectChat(global, chatId)

  return (
    <ListItem
      withRipple
      // className="chat-item"
      title={chat?.title}
      // icon="username"
      additional="12:35"
      subtitle={
        <>
          Watafak niggaWatafak niggaWatafak niggaWatafak niggaWatafak niggaWatafak niggaWatafak
          niggaWatafak nigga
        </>
      }
      // right="3"
      badge="15"
    >
      <AvatarTest variant="BLUE" />
    </ListItem>
  )
}

export {ChatItem}
