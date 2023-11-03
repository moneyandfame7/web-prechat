import {type FC, forwardRef, memo, useEffect, useRef, useState} from 'preact/compat'

import clsx from 'clsx'
import type {CustomItemComponentProps} from 'virtua'

import type {ApiChat, ApiMessage, ApiUser} from 'api/types'

import {getActions} from 'state/action'
import {connect} from 'state/connect'
import {getUserName, isUserId} from 'state/helpers/users'
import {selectChat} from 'state/selectors/chats'
import {selectHasMessageSelection, selectIsMessageSelected} from 'state/selectors/diff'
import {selectUser} from 'state/selectors/users'

import {useContextMenu} from 'hooks/useContextMenu'
import {useBoolean} from 'hooks/useFlag'

import {TEST_translate} from 'lib/i18n'

import DeleteMessagesModal from 'components/popups/DeleteMessagesModal.async'
import {Menu, MenuItem} from 'components/popups/menu'
import {MenuDivider} from 'components/popups/menu/Menu'
import {Icon} from 'components/ui'
import {AvatarTest} from 'components/ui/AvatarTest'

import {MessageMeta} from './MessageMeta'

import './MessageBubble.scss'

interface MessageBubbleProps {
  message: ApiMessage
  withAvatar?: boolean
  isLastInList: boolean
  isLastInGroup: boolean
  isFirstInGroup: boolean
  isFirstUnread: boolean
}
interface StateProps {
  chat: ApiChat | undefined
  hasMessageSelection: boolean
  isSelected: boolean
  showSenderName: boolean
  sender?: ApiUser
}
const getMenuElement = () =>
  document
    .querySelector('#portal')!
    .querySelector('.message-context-menu') as HTMLElement | null
const MessageBubbleImpl: FC<MessageBubbleProps & StateProps> = memo(
  ({
    message,
    chat,
    sender,
    showSenderName,
    withAvatar,
    isLastInGroup,
    isFirstInGroup,
    isLastInList,
    hasMessageSelection,
    isSelected,
    isFirstUnread,
  }) => {
    const {getUser, openChat} = getActions()

    // useEffect(() => {
    //   if (!sender && message.senderId) {
    //     getUser(message.senderId)
    //     console.error('SHOULD FETCH SENDER')
    //   }
    // }, [])
    const messageRef = useRef<HTMLDivElement>(null)
    const menuRef = useRef<HTMLDivElement>(null)

    const {deleteMessages, toggleMessageSelection, toggleMessageEditing} = getActions()
    const isOutgoing = message?.isOutgoing && !message.action

    const senderName = sender && getUserName(sender)
    const messageText = message?.content.formattedText?.text

    const {handleContextMenu, handleContextMenuClose, isContextMenuOpen, styles} =
      useContextMenu(menuRef, messageRef, getMenuElement, undefined, true)
    // messageRef.current.sele
    const {
      value: isDeleteModalOpen,
      setTrue: openDeleteModal,
      setFalse: closeDeleteModal,
    } = useBoolean()

    // const [hasSelectedText, setHasSelectedText] = useState(false)

    const [selectedText, setSelectedText] = useState('')

    useEffect(() => {
      const handleSelectionChange = () => {
        const selection = window.getSelection()
        if (selection && messageRef.current?.contains(selection.anchorNode)) {
          // selection.
          setSelectedText(selection.toString())
        } else {
          setSelectedText('')
        }
      }

      document.addEventListener('selectionchange', handleSelectionChange)

      return () => {
        document.removeEventListener('selectionchange', handleSelectionChange)
      }
    }, [])

    const buildedClass = clsx('bubble', sender && `color-${sender.color.toLowerCase()}`, {
      outgoing: isOutgoing,
      incoming: !message?.isOutgoing && !message?.action,
      action: message?.action,
      'has-avatar': withAvatar,
      'last-in': isLastInGroup,
      'first-in': isFirstInGroup,
      'last-in-list': isLastInList,
      'has-menu-open': isContextMenuOpen,
      'delete-local': message.deleteLocal,
      'is-selected': isSelected,
    })

    // imageRef.current

    const handleToggleSelection = () => {
      // updateMessageSelection(getGlobalState(), message.id)
      toggleMessageSelection({id: message.id})
    }
    const handleToggleEditing = () => {
      toggleMessageEditing({id: message.id, active: true})
    }

    const handleCopyMessageText = () => {
      if (selectedText) {
        navigator.clipboard.writeText(selectedText)
      } else {
        const content = message.content

        if (content.formattedText) {
          navigator.clipboard.writeText(content.formattedText.text)
        }
      }
    }
    const handleCopyMessageMedia = () => {}

    const handleClickAvatar = () => {
      if (!sender) {
        return
      }
      openChat({
        id: sender.id,
        username: sender.username,
        shouldChangeHash: true,
        shouldReplaceHistory: false,
      })
    }

    const hasCopyMessageGroup =
      !!selectedText || !!message.content.photo || !!message.content.formattedText?.text
    const isOutgoingNotRead =
      chat?.lastReadOutgoingMessageId !== undefined &&
      chat?.lastReadOutgoingMessageId < message.orderedId
    const messageSendingStatus =
      message.sendingStatus || (isOutgoingNotRead ? 'unread' : 'success')

    // useEffect(() => {
    //   // хз в чому трабл, тут статус фейлед показується, але messageSendingStatus - unread ))))))
    //   // console.log({messageSendingStatus, text: message.text, status: message.sendingStatus})
    // }, [])

    if (message.action) {
      return (
        <div data-mid={message.id} id={`message-${message.id}`} class={buildedClass}>
          <div class="bubble-content">{TEST_translate(message.action.text)}</div>
        </div>
      )
    }

    return (
      <div
        ref={messageRef}
        data-mid={message.id}
        class={buildedClass}
        onContextMenu={handleContextMenu}
        onClick={
          hasMessageSelection
            ? (e) => {
                handleToggleSelection()
              }
            : undefined
        }
        // onClick={
        //   hasMessageSelection
        //     ? (e) => {
        //         console.log('CLICK ON DIV')
        //         // console.log(e.currentTarget.childNodes.)
        //         // stopEvent(e)
        //         handleToggleSelection()
        //       }
        //     : undefined
        // }
      >
        {isFirstUnread && (
          <div class="bubble action is-unread-divider">
            <div class="bubble-content">{TEST_translate('Message.UnreadMessages')}</div>
          </div>
        )}

        {hasMessageSelection && (
          <div class="bubble-select-checkbox">
            <Icon name="check" color="white" />
            {/* <Checkbox
              fullWidth={false}
              // onToggle={handleToggleSelection}
              checked={isSelected}
              withRipple={false}
              className="bubble-select-checkbox"
            /> */}
          </div>
        )}
        {withAvatar && isLastInGroup && (
          <AvatarTest onClick={handleClickAvatar} size="xs" peer={sender} />
        )}
        <div class="bubble-content">
          {showSenderName && (
            <p class="bubble-content__sender">{senderName || 'USER NAME_UNDF'}</p>
          )}
          <p class="bubble-content__text">
            {messageText}
            <h6>{message.orderedId}</h6>
            {message && (
              <MessageMeta
                hasMessageSelection={hasMessageSelection}
                message={message}
                sendingStatus={messageSendingStatus}
              />
            )}
          </p>
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
          {(selectedText || !!message.content.formattedText?.text) && (
            <MenuItem
              onClick={handleCopyMessageText}
              icon="copy"
              title={TEST_translate(
                selectedText ? 'Message.CopySelectedText' : 'Message.CopyText'
              )}
            />
          )}
          {hasCopyMessageGroup && <MenuDivider />}

          <MenuItem icon="reply">{TEST_translate('Reply')}</MenuItem>
          <MenuItem icon="pin">{TEST_translate('Pin')}</MenuItem>
          <MenuItem onClick={handleToggleEditing} icon="edit" title={TEST_translate('Edit')} />
          {/* hasText &&  */}

          <MenuItem icon="forward">{TEST_translate('Forward')}</MenuItem>
          <MenuItem icon="select" onClick={handleToggleSelection}>
            {TEST_translate('Select')}
          </MenuItem>
          <MenuItem icon="delete" danger onClick={openDeleteModal}>
            {TEST_translate('Delete')}
          </MenuItem>
        </Menu>
        <DeleteMessagesModal
          chat={chat}
          isOpen={isDeleteModalOpen}
          onClose={closeDeleteModal}
          message={message}
        />
      </div>
    )
  }
)
export const VirtualScrollItem = forwardRef<HTMLLIElement, CustomItemComponentProps>(
  ({children, style}, ref) => {
    return (
      <li
        ref={ref}
        style={{
          ...style,
          listStyle: 'none',
          overflow: 'hidden',
          borderRadius: '12px',
          paddingInline: '5px',
          userSelect: 'none',
        }}
      >
        {children}
      </li>
    )
  }
)
export const MessageBubble = memo(
  connect<MessageBubbleProps, StateProps>((state, ownProps) => {
    const sender = ownProps.message.senderId
      ? selectUser(state, ownProps.message.senderId)
      : undefined

    const chat = selectChat(state, ownProps.message.chatId)
    const isPrivateChat = isUserId(ownProps.message.chatId)
    const showSenderName = Boolean(sender) && !ownProps.message?.isOutgoing && !isPrivateChat
    return {
      chat,
      sender,
      hasMessageSelection: selectHasMessageSelection(state),
      isSelected: selectIsMessageSelected(state, ownProps.message.id),
      showSenderName,
    }
  })(MessageBubbleImpl)
)
