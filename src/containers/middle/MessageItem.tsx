import {type FC, memo, useCallback, useRef} from 'preact/compat'

import clsx from 'clsx'

import type {ApiMessage, ApiUser} from 'api/types'

import {getActions} from 'state/action'
import {connect} from 'state/connect'
import {getUserName} from 'state/helpers/users'
import {selectIsPrivateChat} from 'state/selectors/chats'
import {selectMessage} from 'state/selectors/messages'
import {selectUser} from 'state/selectors/users'

import {useContextMenu} from 'hooks/useContextMenu'

// import {formatDate} from 'utilities/date/convert'
import {Menu, MenuItem} from 'components/popups/menu'
import {AvatarTest} from 'components/ui/AvatarTest'

import {MessageMeta} from './message/MessageMeta'

// import './MessageItem.scss'

/**
 * ON DELETE - zoomFade ?
 * WebPage - preview
 */
interface OwnProps {
  messageId: string
  chatId: string
}
interface StateProps {
  message?: ApiMessage
  sender?: ApiUser
  isPrivateChat: boolean
}
const MessageItemImpl: FC<OwnProps & StateProps> = ({
  messageId,
  chatId,
  message,
  sender,
  isPrivateChat,
}) => {
  const {openChat} = getActions()
  const senderName = sender ? getUserName(sender) : undefined

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
      incoming: !message?.isOutgoing && !message?.action,
      action: message?.action,
    }
  )
  const showSender =
    sender &&
    !message?.isOutgoing &&
    !isPrivateChat &&
    !message?.content.photos /* if not bubble - show avatars */

  // console.log('ITEM_RERENDER????????', message.id)

  const menuRef = useRef<HTMLDivElement>(null)
  const messageRef = useRef<HTMLDivElement>(null)
  const getMenuElement = useCallback(() => {
    return document
      .querySelector('#portal')!
      .querySelector('.message-context-menu') as HTMLElement | null
  }, [])

  const {handleContextMenu, handleContextMenuClose, isContextMenuOpen, styles} =
    useContextMenu(menuRef, messageRef, getMenuElement, undefined, true)
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
        <div ref={messageRef} onContextMenu={handleContextMenu} class={buildedClass}>
          {showSender && <AvatarTest onClick={handleClickOnSender} size="xs" peer={sender} />}
          <div class="message-content">
            {showSender && (
              <p onClick={handleClickOnSender} class="message-content__sender">
                {senderName}
              </p>
            )}

            <p class="message-content__text">
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
        <Menu
          // easing={'cubic-bezier(0.2, 0, 0.2, 1)' as any}
          // timeout={250}
          elRef={menuRef}
          withMount
          withPortal
          className="message-context-menu"
          isOpen={isContextMenuOpen}
          style={styles}
          onClose={handleContextMenuClose}
        >
          <MenuItem icon="reply">Reply</MenuItem>
          <MenuItem icon="edit">Edit</MenuItem>
          <MenuItem icon="copy">Copy Text</MenuItem>
          <MenuItem icon="forward">Forward</MenuItem>
          <MenuItem icon="select">Select</MenuItem>
          <MenuItem icon="delete" danger>
            Delete
          </MenuItem>
        </Menu>
      </>
    )
  }

  return <>{renderMessage()}</>
}

export const MessageItem = memo(
  connect<OwnProps, StateProps>((state, ownProps) => {
    const message = selectMessage(state, ownProps.chatId, ownProps.messageId)
    const sender = message?.senderId ? selectUser(state, message.senderId) : undefined

    const isPrivateChat = selectIsPrivateChat(state, ownProps.chatId)
    // const messageStatus=message.se
    // console.log({message, sender})
    // console.log('MESSAGE_RERENDER', ownProps.messageId)
    return {
      message,
      sender,
      isPrivateChat,
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
