import {type FC, memo, useEffect} from 'preact/compat'

import type {ApiMessage, ApiUser} from 'api/types'

import {getActions} from 'state/action'
import {type MapState, connect} from 'state/connect'
import {isUserId} from 'state/helpers/users'
import {selectIsChannel} from 'state/selectors/chats'
import {selectMessage, selectMessageSender, selectMessages} from 'state/selectors/messages'

import {AvatarTest} from 'components/ui/AvatarTest'

import {MessageBubble} from './MessageBubble'

interface MessageBubblesGroupProps {
  /* Ids from one group. */
  groupIds: string[]
  chatId: string
}
interface StateProps {
  senderId: string | undefined
  groupSender?: ApiUser
  messagesById?: Record<string, ApiMessage>
  withAvatar?: boolean
}
/**
 * This component used for "bubble mode"
 */
const MessageBubblesGroupImpl: FC<MessageBubblesGroupProps & StateProps> = ({
  groupIds,
  groupSender,
  messagesById,
  withAvatar,
  senderId,
}) => {
  const {getUser} = getActions()

  useEffect(() => {
    if (!groupSender && senderId) {
      getUser(senderId)
    }
  }, [groupSender, senderId])
  return (
    <div class="bubbles-group">
      {withAvatar && (
        <div class="bubbles-group-avatar-container">
          <AvatarTest className="bubbles-group-avatar" peer={groupSender} size="xs" />
          {/* Avatar here */}
        </div>
      )}

      {/* Test without filter boolean? */}
      {groupIds
        .map((messageId, idx) => {
          const message = messagesById?.[messageId]
          const nextMessage = messagesById?.[groupIds[idx + 1]]
          /**
           * потрібно перевіряти на наступне повідомлення, бо деякий час воно залишатиметься в масиві, проте візуально буде захованне при видаленні
           */
          const isLastInGroup =
            (!message?.deleteLocal && idx === groupIds.length - 1) ||
            Boolean(nextMessage?.deleteLocal)

          return (
            message && (
              <MessageBubble
                key={messageId}
                isLastInGroup={isLastInGroup}
                isFirstInGroup={idx === 0}
                withAvatar={withAvatar}
                message={message}
              />
            )
          )
        })
        .filter(Boolean)}
    </div>
  )
}

const mapStateToProps: MapState<MessageBubblesGroupProps, StateProps> = (state, ownProps) => {
  const senderId = selectMessage(state, ownProps.chatId, ownProps.groupIds[0])?.senderId
  const groupSender = selectMessageSender(state, ownProps.chatId, ownProps.groupIds[0])
  const messagesById = selectMessages(state, ownProps.chatId)
  const lastMessage = messagesById?.[ownProps.groupIds[ownProps.groupIds.length - 1]]

  const withAvatar =
    !messagesById?.[ownProps.groupIds[0]]?.action &&
    !groupSender?.isSelf &&
    (isUserId(ownProps.chatId) || !selectIsChannel(state, ownProps.chatId)) /*  &&
    !lastMessage?.deleteLocal */ &&
    !(ownProps.groupIds.length === 1 && lastMessage?.deleteLocal)

  // const withSenderName=!groupSender.isS

  // без аватарки ще буде тоді, коли кількість повідомлень - 1 і це повідомлення видалене ?

  return {
    senderId,
    groupSender,
    messagesById,
    withAvatar,
  }
}
export const MessageBubblesGroup = memo(connect(mapStateToProps)(MessageBubblesGroupImpl))

// export {MessageBubblesGroup}
