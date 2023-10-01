import {type FC, useRef} from 'preact/compat'

import {type ApiMessageSendingStatus} from 'api/types'

import {Transition} from 'components/transitions'
import {Icon} from 'components/ui'

interface MessageOutgoingStatusProps {
  status: ApiMessageSendingStatus
}

const MessageSendingStatus: FC<MessageOutgoingStatusProps> = ({status}) => {
  const refStatus = useRef(status)
  function renderStatus() {
    switch (status) {
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
    <div class="message-sending-status">
      <Transition appear={refStatus.current === 'pending'} name="zoomIcon" activeKey={status}>
        {renderStatus()}
      </Transition>
    </div>
  )
}

export {MessageSendingStatus}
