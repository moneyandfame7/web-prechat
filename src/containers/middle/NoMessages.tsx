import {type FC} from 'preact/compat'

import {Icon} from 'components/ui'

import './NoMessages.scss'

interface NoMessagesProps {
  isSavedMessages?: boolean
}
const NoMessages: FC<NoMessagesProps> = ({isSavedMessages}) => {
  function renderSavedMessagesText() {
    return (
      <div class="no-messages__saved-messages">
        <Icon className="icon" name="cloudDownload" />
        <h4 class="title">Your cloud storage</h4>
        <ul class="list">
          <li>Forward messages here to save them</li>
          <li>Send media and files to store them</li>
          <li>Access this chat from any device</li>
          <li>Use search for quickly find things</li>
        </ul>
      </div>
    )
  }

  return (
    <div class="no-messages-wrapper">
      <div class="no-messages">{isSavedMessages && renderSavedMessagesText()}</div>
    </div>
  )
}

export {NoMessages}
