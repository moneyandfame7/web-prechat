import {type FC, memo} from 'preact/compat'

import type {ApiChat} from 'api/types'
import type {ApiMessage} from 'api/types/messages'

import {type MapState, connect} from 'state/connect'
import {selectChatMessages} from 'state/selectors/messages'

import {MessageItem} from './MessageItem'

import './MessagesList.scss'

type OwnProps = {
  chat: ApiChat
}

type StateProps = {
  messagesIds: string[]
  messagesById?: Record<string, ApiMessage>
}
/**
 * @todo views, sending status icon,
 * group by date + group by time
 */
const MessagesListImpl: FC = () => {
  return (
    <div class="messages-list scrollable">
      <div class="messages-container">
        {/* <ListItem title="Lol" subtitle="eshkere"></ListItem> */}
        <MessageItem />
      </div>
    </div>
  )
}

const mapStateToProps: MapState<OwnProps, StateProps> = (state, ownProps) => {
  const {chat} = ownProps
  const messagesById = selectChatMessages(state, chat.id)

  return {
    messagesById,
    messagesIds: [],
  }
}

export const MessagesList = memo(connect(mapStateToProps)(MessagesListImpl))
