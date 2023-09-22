import {type FC, memo, useMemo} from 'preact/compat'

import clsx from 'clsx'

import type {ApiChat, ApiUser} from 'api/types'

import {connect} from 'state/connect'
import {getChatName_deprecated, getChatRoute} from 'state/helpers/chats'
import {getMessageText} from 'state/helpers/messages'
import {isUserId} from 'state/helpers/users'
import {selectChat} from 'state/selectors/chats'
import {isUserOnline, selectUser} from 'state/selectors/users'
import {getGlobalState} from 'state/signal'

import {formatDate} from 'utilities/date/convert'

import {SingleTransition} from 'components/transitions'
import {AvatarTest} from 'components/ui/AvatarTest'
import {ListItem} from 'components/ui/ListItem'

import './ChatItem.scss'

type OwnProps = {
  chatId: string
}
type StateProps = {
  lastMessageSender?: ApiUser
  user?: ApiUser
  chat?: ApiChat
  isOnline?: boolean
  isSavedMessages?: boolean
  isPrivate?: boolean
  currentChatId?: string
}
const ChatItemImpl: FC<OwnProps & StateProps> = ({
  lastMessageSender,
  user,
  chat,
  isOnline,
  isSavedMessages,
  isPrivate,
  currentChatId,
}) => {
  const global = getGlobalState()
  const chatRoute = getChatRoute(isPrivate ? user : chat)
  const chatDate = useMemo(
    () => chat && formatDate(new Date(chat?.createdAt), true, false),
    [chat?.createdAt]
  )

  // const handleClick = (e: TargetedEvent<HTMLElement, MouseEvent>) => {
  //   e.preventDefault()
  //   openChat({id: chat?.id, shouldChangeHash: true, username: user?.username})
  // }

  // const clickHandlers = useFastClick({fast: true, handler: handleClick})

  const buildedClass = clsx('chat-item', {
    opened: currentChatId === chat?.id,
  })
  return (
    <ListItem
      // onClick={handleClick}
      withContextMenuPortal
      href={chatRoute}
      withRipple
      className={buildedClass}
      title={chat && getChatName_deprecated(global, chat)}
      // icon="username"
      additional={chatDate}
      subtitle={<>{getMessageText(chat?.lastMessage, lastMessageSender)}</>}
      // right="3"
      badge={chat?.unreadCount || undefined}
    >
      <div class="status">
        <AvatarTest peer={chat} isSavedMessages={isSavedMessages} withOnlineStatus />
        {isPrivate && !isSavedMessages && (
          <SingleTransition in={isOnline} name="zoomFade" className="online-badge-transition">
            <span class="online-badge" />
          </SingleTransition>
        )}
      </div>
    </ListItem>
  )
}

// export {ChatItemImpl as ChatItem}
export const ChatItem = memo(
  connect<OwnProps, StateProps>((state, ownProps) => {
    const chat = selectChat(state, ownProps.chatId)
    if (!chat) {
      return {}
    }
    const {senderId /* , text, isOutgoing */} = chat.lastMessage || {}
    const lastMessageSender = senderId ? selectUser(state, senderId) : undefined

    const isPrivate = chat?.type === 'chatTypePrivate'
    const user = isUserId(ownProps.chatId) ? selectUser(state, ownProps.chatId) : undefined

    const isSavedMessages = chat?.id === state.auth.userId
    const isOnline = user ? isUserOnline(user) : undefined
    const currentChatId = state.currentChat.chatId
    return {
      isSavedMessages,
      lastMessageSender,
      chat,
      isPrivate,
      isOnline,
      user,
      currentChatId,
    }
  })(ChatItemImpl)
)
