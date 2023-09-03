import type {FC} from 'preact/compat'

import {getChatName} from 'state/helpers/chats'
import {selectChat, selectIsChatWithSelf} from 'state/selectors/chats'
import {getGlobalState} from 'state/signal'

import {formatDate} from 'utilities/date/convert'

import {Icon} from 'components/ui'
import {AvatarTest} from 'components/ui/AvatarTest'
import {ListItem} from 'components/ui/ListItem'

import './ChatItem.scss'

interface ChatItemProps {
  chatId: string
  userId?: string
}
const ChatItem: FC<ChatItemProps> = ({chatId}) => {
  const global = getGlobalState()
  const chat = selectChat(global, chatId)
  const isSelf = selectIsChatWithSelf(global, chatId)

  // chat.

  return (
    <ListItem
      withRipple
      className="chat-item"
      title={chat && getChatName(global, chat)}
      // icon="username"
      additional={chat && formatDate(new Date(chat?.createdAt), true, false)}
      subtitle={
        <>
          Watafak niggaWatafak niggaWatafak niggaWatafak niggaWatafak niggaWatafak niggaWatafak
          niggaWatafak nigga
        </>
      }
      // right="3"
      badge="15"
    >
      <AvatarTest peer={chat} isSavedMessages={true} />
    </ListItem>
  )
}

export {ChatItem}
