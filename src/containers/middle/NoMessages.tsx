import {type FC} from 'preact/compat'

import type {ApiChatType, ApiMessage} from 'api/types'

import {TEST_translate} from 'lib/i18n'

import {Icon} from 'components/ui'

import './NoMessages.scss'

interface NoMessagesProps {
  isSavedMessages: boolean
  type: ApiChatType | undefined
  lastMessage?: ApiMessage
  isPinnedList: boolean | undefined
  isChannel: boolean | undefined
  isGroup: boolean | undefined
  isPrivate: boolean | undefined
}
const NoMessages: FC<NoMessagesProps> = ({
  type,
  isSavedMessages,
  isChannel,
  isGroup,
  isPrivate,
  isPinnedList,
}) => {
  function renderSavedMessagesText() {
    return (
      <div class="no-messages__saved-messages">
        <Icon className="icon" name="cloudDownload" />
        <h4 class="title">{TEST_translate('SavedMessagesTitle')}</h4>
        <ul class="list">
          <li>{TEST_translate('SavedMessagesDescription1')}</li>
          <li>{TEST_translate('SavedMessagesDescription2')}</li>
          <li>{TEST_translate('SavedMessagesDescription3')}</li>
          <li>{TEST_translate('SavedMessagesDescription4')}</li>
        </ul>
      </div>
    )
  }

  function renderPinnedMessages() {
    return (
      <div class="no-messages__pinned-messages">
        <Icon className="icon" name="pinlist" />
        <h4 class="title">{TEST_translate('PinnedMessagesTitle')}</h4>
        <ul class="list">
          <li>{TEST_translate('PinnedMessagesDescription1')}</li>
          <li>{TEST_translate('PinnedMessagesDescription2')}</li>
          <li>{TEST_translate('PinnedMessagesDescription3')}</li>
        </ul>
      </div>
    )
  }

  function renderPrivateText() {
    return <h4 class="title">{TEST_translate('NoMessages')}</h4>
  }

  function renderChannelText() {
    return <>render channel</>
  }

  function renderGroupText() {
    return (
      <>
        <h4 class="title">{TEST_translate('GroupEmptyTitle1')}</h4>
        <h4 class="title">{TEST_translate('GroupEmptyTitle2')}</h4>
        <ul class="list">
          <li>{TEST_translate('GroupDescription1')}</li>
          <li>{TEST_translate('GroupDescription2')}</li>
          <li>{TEST_translate('GroupDescription3')}</li>
          <li>{TEST_translate('GroupDescription4')}</li>
        </ul>
      </>
    )
  }

  function renderContent() {
    if (isSavedMessages) {
      return renderSavedMessagesText()
    }
    if (isPinnedList) {
      return renderPinnedMessages()
    }
    if (isChannel) return renderChannelText()
    if (isGroup) return renderGroupText()
    if (isPrivate) return renderPrivateText()
  }

  return (
    <div class="no-messages-wrapper">
      <div class="no-messages">{renderContent()}</div>
    </div>
  )
}

export {NoMessages}
