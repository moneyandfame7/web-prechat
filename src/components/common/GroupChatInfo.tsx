import {type FC, memo} from 'preact/compat'

import type {ApiChat} from 'api/types'

import {type MapState, connect} from 'state/connect'
import {selectChat, selectChatFull, selectOnlineCount} from 'state/selectors/chats'

import {AvatarTest} from 'components/ui/AvatarTest'

interface OwnProps {
  chatId: string
}
interface StateProps {
  onlineCount?: number
  chat?: ApiChat
}
const GroupChatInfoImpl: FC<OwnProps & StateProps> = ({chat, onlineCount}) => {
  return (
    <div class="chat-info group">
      <AvatarTest variant={chat?.color} size="s" fullName={chat?.title} />
      <div class="chat-info__container">
        <p class="list-item__title">{chat?.title}</p>
        {chat?.membersCount && (
          <p class="list-item__subtitle">
            {chat.membersCount} members{onlineCount ? `, ${onlineCount} online` : null}
          </p>
        )}
      </div>
    </div>
  )
}

const mapStateToProps: MapState<OwnProps, StateProps> = (state, ownProps) => {
  const chat = selectChat(state, ownProps.chatId)
  const chatFull = selectChatFull(state, ownProps.chatId)
  if (!chatFull) {
    return {}
  }
  const onlineCount = selectOnlineCount(state, chatFull)

  // const onlineCount=chatFull.
  return {
    onlineCount,
    chat,
  }
}
export const GroupChatInfo = memo(connect(mapStateToProps)(GroupChatInfoImpl))
