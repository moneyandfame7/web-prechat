import {type FC, memo} from 'preact/compat'

import type {ApiChat} from 'api/types'

import {type MapState, connect} from 'state/connect'
import {
  isChatChannel,
  selectChat,
  selectChatFull,
  selectOnlineCount,
} from 'state/selectors/chats'

import {AvatarTest} from 'components/ui/AvatarTest'

interface OwnProps {
  chatId: string
}
interface StateProps {
  onlineCount?: number
  chat?: ApiChat
  isChannel?: boolean
}
const GroupChatInfoImpl: FC<OwnProps & StateProps> = ({chat, onlineCount, isChannel}) => {
  return (
    <div class="chat-info group">
      <AvatarTest size="s" peer={chat} />
      <div class="chat-info__container">
        <p class="list-item__title">{chat?.title}</p>
        {chat?.membersCount && (
          <p class="list-item__subtitle">
            {chat.membersCount} {isChannel ? 'subscribers' : 'members'}
            {onlineCount ? `, ${onlineCount} online` : null}
          </p>
        )}
      </div>
    </div>
  )
}

const mapStateToProps: MapState<OwnProps, StateProps> = (state, ownProps) => {
  const chat = selectChat(state, ownProps.chatId)
  const chatFull = selectChatFull(state, ownProps.chatId)

  const onlineCount = chatFull ? selectOnlineCount(state, chatFull) : undefined
  const isChannel = chat && isChatChannel(chat)
  // const onlineCount=chatFull.
  return {
    onlineCount,
    chat,
    isChannel,
  }
}
export const GroupChatInfo = memo(connect(mapStateToProps)(GroupChatInfoImpl))
