import {type FC, memo} from 'preact/compat'

import type {ApiMessage, ApiMessageSendingStatus} from 'api/types'

import {formatDate} from 'utilities/date/convert'

import {Icon} from 'components/ui'

import {MessageSendingStatus} from './MessageSendingStatus'

interface MessageMetaProps {
  message: ApiMessage
  sendingStatus: ApiMessageSendingStatus
}
const MessageMeta: FC<MessageMetaProps> = memo(({message, sendingStatus}) => {
  const messageSendDate = message
    ? formatDate(new Date(message?.createdAt), true, false)
    : undefined

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
    <span class="message-meta">
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
})

export {MessageMeta}
