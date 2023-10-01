import {type FC, memo} from 'preact/compat'

import type {ApiMessage, ApiUser} from 'api/types'

import {type MapState, connect} from 'state/connect'
import {isUserId} from 'state/helpers/users'
import {selectIsChannel} from 'state/selectors/chats'
import {selectMessageSender, selectMessages} from 'state/selectors/messages'

import {AvatarTest} from 'components/ui/AvatarTest'

import {MessageBubble} from './MessageBubble'

interface MessageBubblesGroupProps {
  /* Ids from one group. */
  groupIds: string[]
  chatId: string
}
interface StateProps {
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
}) => {
  return (
    <div class="bubbles-group">
      {withAvatar && (
        <div class="bubbles-group-avatar-container">
          <div class="bubbles-group-avatar">
            <AvatarTest peer={groupSender} size="xs" />
          </div>
          {/* Avatar here */}
        </div>
      )}

      {/* Test without filter boolean? */}
      {groupIds
        .map((messageId, idx) => {
          const message = messagesById?.[messageId]

          const isLastInGroup = idx === groupIds.length - 1
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
  const groupSender = selectMessageSender(state, ownProps.chatId, ownProps.groupIds[0])
  const messagesById = selectMessages(state, ownProps.chatId)

  const withAvatar =
    /* хз, треба переробити адже  */
    !messagesById?.[ownProps.groupIds[0]].action &&
    !groupSender?.isSelf &&
    (isUserId(ownProps.chatId) || !selectIsChannel(state, ownProps.chatId))

  return {
    groupSender,
    messagesById,
    withAvatar,
  }
}
export const MessageBubblesGroup = memo(connect(mapStateToProps)(MessageBubblesGroupImpl))

// export {MessageBubblesGroup}
