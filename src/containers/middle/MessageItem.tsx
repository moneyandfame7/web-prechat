import {type FC, memo, useCallback} from 'preact/compat'

import clsx from 'clsx'

import type {ApiMessage, ApiUser} from 'api/types'

import {getActions} from 'state/action'
import {connect} from 'state/connect'
import {getUserName} from 'state/helpers/users'
import {selectMessage} from 'state/selectors/messages'
import {selectUser} from 'state/selectors/users'

import {formatDate} from 'utilities/date/convert'

import {AvatarTest} from 'components/ui/AvatarTest'

import {MessageMeta} from './message/MessageMeta'

import './MessageItem.scss'

/**
 * ON DELETE - zoomFade ?
 * WebPage - preview
 */
interface OwnProps {
  messageId: string
  chatId: string
}
interface StateProps {
  message: ApiMessage
  sender?: ApiUser
}
const MessageItemImpl: FC<OwnProps & StateProps> = ({messageId, chatId, message, sender}) => {
  const {openChat} = getActions()
  const senderName = sender ? getUserName(sender) : undefined

  const messageSendDate = message
    ? formatDate(new Date(message?.createdAt), true, false)
    : undefined

  const handleClickOnSender = useCallback(() => {
    console.log('SENDER ID:', sender?.id)
    if (sender) {
      openChat({
        id: sender.id,
        shouldChangeHash: true,
        username: sender.username,
        shouldReplaceHistory: false,
      })
    }
  }, [sender])
  const messageText = message?.content.formattedText?.text
  const buildedClass = clsx(
    'message-item',
    'bubble',
    sender && `color-${sender?.color.toLowerCase()}`,
    {
      outgoing: message?.isOutgoing && !message.action,
      incoming: !message?.isOutgoing && !message.action,
      action: message?.action,
    }
  )
  const showAvatar = sender && !message?.isOutgoing /* if not bubble - show avatars */

  // console.log('ITEM_RERENDER????????', message.id)
  function renderMessage() {
    if (message?.action) {
      return (
        <div class={buildedClass}>
          <div class="message-content">{message.action.text}</div>
        </div>
      )
    }
    return (
      <>
        <div class={buildedClass}>
          {showAvatar && <AvatarTest onClick={handleClickOnSender} size="xs" peer={sender} />}
          <div class="message-content">
            <p onClick={handleClickOnSender} class="message-content__sender">
              {senderName}
            </p>
            <p class="message-content__text">
              {messageText}

              <MessageMeta
                message={message}
                sendingStatus={message.sendingStatus || 'unread'}
              />
            </p>
          </div>
        </div>
      </>
    )
  }

  return <>{renderMessage()}</>
}

export const MessageItem = memo(
  connect<OwnProps, StateProps>((state, ownProps) => {
    const message = selectMessage(state, ownProps.chatId, ownProps.messageId)!
    const sender = message?.senderId ? selectUser(state, message.senderId) : undefined
    // const messageStatus=message.se
    // console.log({message, sender})
    // console.log('MESSAGE_RERENDER', ownProps.messageId)
    return {
      message,
      sender,
    }
  })(MessageItemImpl)
)

// META:
/* <span class="message-meta">
<i class="message-meta__item">edited</i>

<span class="message-meta__item">{messageSendDate}</span>

{message?.isOutgoing && (
  <span class="message-meta__item message-meta__views">
    <Icon name="checks2" className="message-meta__icon" />
  </span>
)}
<div class="message-meta__container">
  <i class="message-meta__item">edited</i>

  <span class="message-meta__item message-meta__date">{messageSendDate}</span>
  {message?.isOutgoing && (
    <span class="message-meta__item message-meta__views">
      <Icon name="checks2" className="message-meta__icon" />
    </span>
  )}
</div>
</span> */

////
/* <div class="message-item bubble outgoing">
<div class="message-content">
  <p class="message-content__sender">{senderName}</p>
  <p class="message-content__text">
    {message?.content.formattedText?.text}
    <span class="message-meta">
      <i class="message-meta__item">edited</i>

      <span class="message-meta__item">{messageSendDate}</span>
      <span class="message-meta__item message-meta__views">
        <Icon name="checks2" className="message-meta__icon" />
      </span>
      <div class="message-meta__container">
        <i class="message-meta__item">edited</i>

        <span class="message-meta__item message-meta__date">{messageSendDate}</span>
        <span class="message-meta__item message-meta__views">
          <Icon name="checks2" className="message-meta__icon" />
        </span>
      </div>
    </span>
  </p>
</div>
</div>
<div class="message-item bubble incoming">
<AvatarTest variant="GREEN" size="xs" text="D" />

<div class="message-content">
  <p class="message-content__sender">Dolbaebik</p>
  <p class="message-content__text">
    Hello, bro!
    <span class="message-meta">
      <i class="message-meta__item">edited</i>

      <span class="message-meta__item">13:25</span>
      <span class="message-meta__item message-meta__views">
        <Icon name="checks2" className="message-meta__icon" />
      </span>
      <div class="message-meta__container">
        <i class="message-meta__item">edited</i>

        <span class="message-meta__item message-meta__date">13:25</span>
        <span class="message-meta__item message-meta__views">
          <Icon name="checks2" className="message-meta__icon" />
        </span>
      </div>
    </span>
  </p>
</div>
</div>
<div class="message-item bubble incoming">
{/* <AvatarTest variant="GREEN" size="s" /
> */

// <div class="message-content">
//   <p class="message-content__sender">Dolbaebik</p>
//   <p class="message-content__text">
//     Hello, bro!Hello, bro!Hello, bro!Hello, bro!Hello, bro!Hello, bro!Hello, bro!Hello,
//     bro!Hello, bro!bro!Hello, bro!bro!Hello, bro!bro!Hellasdasd
//     <span class="message-meta">
//       <i class="message-meta__item">edited</i>

//       <span class="message-meta__item">13:25</span>
//       <span class="message-meta__item message-meta__views">
//         <Icon name="checks2" className="message-meta__icon" />
//       </span>
//       <div class="message-meta__container">
//         <i class="message-meta__item">edited</i>

//         <span class="message-meta__item message-meta__date">13:25</span>
//         <span class="message-meta__item message-meta__views">
//           <Icon name="checks2" className="message-meta__icon" />
//         </span>
//       </div>
//     </span>
//   </p>
// </div>
// </div>
// <div class="message-item action">
// <div class="message-content">Lorem</div>
// </div> */}
