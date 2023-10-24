import {type FC, memo} from 'preact/compat'

import type {ApiLangCode, ApiMessage, ApiMessageSendingStatus} from 'api/types'

import {getActions} from 'state/action'
import {connect} from 'state/connect'
import {selectGeneralSettings} from 'state/selectors/settings'

import {formatDate, formatMessageTime} from 'utilities/date/convert'
import {stopEvent} from 'utilities/stopEvent'

import type {TimeFormat} from 'types/state'

import {Icon} from 'components/ui'

import {MessageSendingStatus} from './MessageSendingStatus'

interface MessageMetaProps {
  message: ApiMessage
  sendingStatus: ApiMessageSendingStatus
  hasMessageSelection: boolean
}
interface StateProps {
  timeFormat: TimeFormat
  language: ApiLangCode
}
const MessageMetaImpl: FC<MessageMetaProps & StateProps> = memo(
  ({message, sendingStatus, /* hasMessageSelection */ timeFormat, language}) => {
    const messageSendDate = message
      ? formatMessageTime(new Date(message?.createdAt))
      : undefined
    const isEdited = Boolean(message.editedAt)
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

    const handleDisplayTitle = () => {
      const sendedDate = formatDate(
        new Date(message.createdAt),
        timeFormat === '24h',
        true,
        true,
        true,
        language
      )
      if (isEdited) {
        return `${sendedDate}
Edited: ${formatDate(
          new Date(message.editedAt!),
          timeFormat === '24h',
          true,
          true,
          true,
          language
        )}`
      }
      return sendedDate
    }
    return (
      <span
        title={handleDisplayTitle()}
        class="message-meta"
        onClick={(e) => {
          stopEvent(e)
          toggleMessageSelection({id: message.id})
        }}
      >
        {isEdited && <i class="message-meta__item">edited</i>}

        {/* it's a «fake» element */}
        <span class="message-meta__item">{messageSendDate}</span>

        {message?.isOutgoing && (
          <span class="message-meta__item message-meta__views">
            {/* <Icon name="checks2" className="message-meta__icon" /> */}
            {renderStatus()}
          </span>
        )}
        <div class="message-meta__container">
          {/* <i class="message-meta__item">edited</i> */}
          {isEdited && <i class="message-meta__item">edited</i>}

          <span class="message-meta__item message-meta__date">{messageSendDate}</span>
          {message?.isOutgoing && <MessageSendingStatus status={sendingStatus} />}
        </div>
      </span>
    )
  }
)

export const MessageMeta = memo(
  connect<MessageMetaProps, StateProps>((state) => {
    return {
      timeFormat: selectGeneralSettings(state, 'timeFormat'),
      language: state.settings.language,
    }
  })(MessageMetaImpl)
)
