import {type FC, useCallback} from 'preact/compat'

import {getActions} from 'state/action'
import {getChatName} from 'state/helpers/chats'
import {selectChat, selectIsChatWithSelf} from 'state/selectors/chats'
import {selectIsOnline, selectUser} from 'state/selectors/users'
import {getGlobalState} from 'state/signal'

import {formatDate} from 'utilities/date/convert'

import {AvatarTest} from 'components/ui/AvatarTest'
import {ListItem} from 'components/ui/ListItem'

import './ChatItem.scss'

interface ChatItemProps {
  chatId: string
}
const ChatItem: FC<ChatItemProps> = ({chatId}) => {
  const global = getGlobalState()
  const {openChat} = getActions()
  const chat = selectChat(global, chatId)
  const user = chat && chat.userId ? selectUser(global, chat?.userId) : undefined
  const isSaved = selectIsChatWithSelf(global, chatId)
  const isOnline = !isSaved && user ? selectIsOnline(user) : undefined

  const handleClickChat = useCallback(() => {
    openChat({id: chatId})
  }, [])
  return (
    <ListItem
      to={`http://localhost:8000/#${user ? user.id : chatId}`}
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
      onClick={handleClickChat}
      // right="3"
      badge="15"
    >
      <AvatarTest peer={chat} isSavedMessages={isSaved} onlineBadge={isOnline} />
    </ListItem>
  )
}

export {ChatItem}
