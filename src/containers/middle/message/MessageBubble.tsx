import {type FC, memo} from 'preact/compat'

import clsx from 'clsx'

import type {ApiMessage, ApiUser} from 'api/types'

import {getUserName} from 'state/helpers/users'

import {MessageMeta} from './MessageMeta'

import './MessageBubble.scss'

interface MessageBubbleProps {
  message: ApiMessage
  sender?: ApiUser
  withSenderName?: boolean
  withAvatar?: boolean
  isLastInGroup: boolean
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

    return (
      <div class={buildedClass}>
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
      </div>
    )
  }
)

export {MessageBubble}
