import {type FC, memo} from 'preact/compat'

import clsx from 'clsx'

import type {ApiMessage, ApiUser} from 'api/types'

import {getUserName} from 'state/helpers/users'

import {TEST_translate} from 'lib/i18n'

import {MessageMeta} from './MessageMeta'

import './MessageBubble.scss'

interface MessageBubbleProps {
  message: ApiMessage
  sender?: ApiUser
  withSenderName?: boolean
  withAvatar?: boolean
  isLastInGroup: boolean
  isFirstInGroup: boolean
}
const MessageBubble: FC<MessageBubbleProps> = memo(
  ({message, sender, withSenderName, withAvatar, isLastInGroup}) => {
    const isOutgoing = message?.isOutgoing && !message.action
    const buildedClass = clsx('bubble', sender && `color-${sender.color.toLowerCase()}`, {
      outgoing: isOutgoing,
      incoming: !message?.isOutgoing && !message?.action,
      action: message?.action,
      'has-avatar': withAvatar,
      'last-in': isLastInGroup,
    })

    const senderName = sender && getUserName(sender)
    const messageText = message?.content.formattedText?.text
    if (message.action) {
      return (
        <div data-mid={message.id} id={`message-${message.id}`} class={buildedClass}>
          <div class="bubble-content">{TEST_translate(message.action.text)}</div>
        </div>
      )
    }
    return (
      <div data-mid={message.id} class={buildedClass}>
        <div class="bubble-content">
          {withSenderName && (
            <p class="bubble-content__sender">{senderName || 'USER NAME_UNDF'}</p>
          )}
          <p class="bubble-content__text">
            {messageText}
            {message && (
              <MessageMeta
                message={message}
                sendingStatus={message.sendingStatus || 'unread'}
              />
            )}
          </p>
        </div>
        <svg viewBox="0 0 11 20" width="11" height="20" class="bubble-arrow">
          <g transform="translate(9 -14)" fill="inherit" fill-rule="evenodd">
            <path
              d="M-6 16h6v17c-.193-2.84-.876-5.767-2.05-8.782-.904-2.325-2.446-4.485-4.625-6.48A1 1 0 01-6 16z"
              transform="matrix(1 0 0 -1 0 49)"
              id="corner-fill"
              fill="inherit"
            />
          </g>
        </svg>
      </div>
    )
  }
)

export {MessageBubble}
