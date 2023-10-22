import {type FC, memo} from 'preact/compat'

import type {ApiMessage, ApiMessageSendingStatus} from 'api/types'

import {getActions} from 'state/action'

import {formatMessageTime} from 'utilities/date/convert'
import {stopEvent} from 'utilities/stopEvent'

import {Icon} from 'components/ui'

import {MessageSendingStatus} from './MessageSendingStatus'

interface MessageMetaProps {
  message: ApiMessage
  sendingStatus: ApiMessageSendingStatus
  hasMessageSelection: boolean
}
const MessageMeta: FC<MessageMetaProps> = memo(
  ({message, sendingStatus, hasMessageSelection}) => {
    const messageSendDate = message
      ? formatMessageTime(new Date(message?.createdAt))
      : undefined
    const {toggleMessageSelection} = getActions()
    function renderStatus() {
      switch (sendingStatus) {
        case 'failed':
          return <Icon className="message-meta__icon" name="sendingError" />
        case 'pending':
          return <Icon className="message-meta__icon" name="sending" />
        case 'unread':
          return <Icon className="message-meta__icon" name="check1" />
        case 'success':
          return <Icon className="message-meta__icon" name="checks2" />
      }
    }
    return (
      <span
        class="message-meta"
        onClick={(e) => {
          stopEvent(e)
          toggleMessageSelection({id: message.id})
        }}
      >
        {/* <i class="message-meta__item">edited</i> */}

        <span class="message-meta__item">{messageSendDate}</span>

        {message?.isOutgoing && (
          <span class="message-meta__item message-meta__views">
            {/* <Icon name="checks2" className="message-meta__icon" /> */}
            {renderStatus()}
          </span>
        )}
        <div class="message-meta__container">
          {/* <i class="message-meta__item">edited</i> */}

          <span class="message-meta__item message-meta__date">{messageSendDate}</span>
          {message?.isOutgoing && <MessageSendingStatus status={sendingStatus} />}
        </div>
      </span>
    )
  }
)

export {MessageMeta}
