import {type FC, forwardRef, memo, useEffect, useRef, useState} from 'preact/compat'

import clsx from 'clsx'
import type {CustomItemComponentProps} from 'virtua'

import type {ApiChat, ApiChatMember, ApiMessage, ApiUser} from 'api/types'

import {getActions} from 'state/action'
import {connect} from 'state/connect'
import {getUserName, isUserId} from 'state/helpers/users'
import {getChatMember, selectChat, selectChatMember} from 'state/selectors/chats'
import {
  selectHasMessageSelection,
  selectIsMessageSelected,
  selectSelectedMessages,
} from 'state/selectors/diff'
import {selectUser} from 'state/selectors/users'

import {useContextMenu} from 'hooks/useContextMenu'
import {useBoolean} from 'hooks/useFlag'

import {TEST_translate} from 'lib/i18n'

import {Document} from 'components/common/Document'
import {Photo} from 'components/common/Photo'
import DeleteMessagesModal from 'components/popups/DeleteMessagesModal.async'
import {Menu, MenuItem} from 'components/popups/menu'
import {MenuDivider} from 'components/popups/menu/Menu'
import {Icon} from 'components/ui'
import {AvatarTest} from 'components/ui/AvatarTest'

import {MessageMeta} from './MessageMeta'

import './MessageBubble.scss'

interface OwnProps {
  message: ApiMessage
  withAvatar?: boolean
  isLastInList: boolean
  isLastInGroup: boolean
  isFirstInGroup: boolean
  isFirstUnread: boolean
}
interface StateProps {
  chat: ApiChat | undefined
  sender: ApiUser | undefined
  chatMember: ApiChatMember | undefined
  hasMessageSelection: boolean
  isSelected: boolean
  selectedMessages: ApiMessage[]
  showSenderName: boolean
}
const getMenuElement = () =>
  document
    .querySelector('#portal')!
    .querySelector('.message-context-menu') as HTMLElement | null
const MessageBubbleImpl: FC<OwnProps & StateProps> = memo(
  ({
    /* OwnProps */
    message,
    withAvatar,
    isLastInGroup,
    isFirstInGroup,
    isLastInList,
    isFirstUnread,

    chat,
    sender,
    chatMember,
    showSenderName,
    hasMessageSelection,
    isSelected,
    selectedMessages,
  }) => {
    const messageRef = useRef<HTMLDivElement>(null)
    const menuRef = useRef<HTMLDivElement>(null)
    const contextMenuImgTarget = useRef<HTMLElement | null>(null)

    const {deleteMessages, openChat, toggleMessageSelection, toggleMessageEditing} =
      getActions()
    const isOutgoing = message?.isOutgoing && !message.action

    const senderName = sender && getUserName(sender)
    const messageText = message?.content.formattedText?.text || message.text

    const onContextMenuClose = () => {
      const img = contextMenuImgTarget.current
      if (!img) {
        return
      }
      img.style.filter = ''
    }

    const {handleContextMenu, handleContextMenuClose, isContextMenuOpen, styles} =
      useContextMenu(
        menuRef,
        messageRef,
        getMenuElement,
        undefined,
        true,
        undefined,
        undefined,
        onContextMenuClose
      )
    const {
      value: isDeleteModalOpen,
      setTrue: openDeleteModal,
      setFalse: closeDeleteModal,
    } = useBoolean()

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
    const hasPhoto = message.content.photos && message.content.photos.length > 0
    const hasDocument = message.content.documents && message.content.documents.length > 0
    const hasOnePhoto = hasPhoto && message.content.photos!.length === 1
    const isAlbum = hasPhoto && message.content.photos!.length > 1

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
      'is-album': isAlbum,
      'has-photo': hasPhoto,
      'has-document': hasDocument,
      'is-message-empty': !message.text,
    })

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

    const isCopyable =
      !!selectedText || !!message.content.photos || !!message.content.formattedText?.text
    const isOutgoingNotRead =
      chat?.lastReadOutgoingMessageId !== undefined &&
      chat?.lastReadOutgoingMessageId < message.orderedId
    const messageSendingStatus =
      message.sendingStatus || (isOutgoingNotRead ? 'unread' : 'success')

    const canDelete = message.isOutgoing || chat?.isOwner || chatMember?.isAdmin

    if (message.action) {
      return (
        <div data-mid={message.id} id={`message-${message.id}`} class={buildedClass}>
          <div class="bubble-content">{TEST_translate(message.action.text)}</div>
        </div>
      )
    }

    function renderMenuItems() {
      if (hasMessageSelection) {
        if (!isSelected) {
          return <MenuItem title={TEST_translate('Select')} icon="select" />
        }

        const canCopy = selectedMessages.some((message) => !!message.text)
        const canDownload = selectedMessages.some((message) => !!message.content.photos)
        return (
          <>
            {canCopy && (
              <MenuItem title={TEST_translate('Message.CopySelected')} icon="copy" />
            )}
            <MenuItem icon="forward" title={TEST_translate('Message.ForwardSelected')} />
            {canDownload && (
              <MenuItem title={TEST_translate('Message.DownloadSelected')} icon="download" />
            )}
            <MenuItem title={TEST_translate('Message.ClearSelection')} icon="select" />
            <MenuItem danger title={TEST_translate('Message.DeleteSelected')} icon="delete" />
          </>
        )
      }

      const canCopyImage = message.content.photos?.length === 1
      return (
        <>
          {(selectedText || !!message.content.formattedText?.text) && (
            <MenuItem
              onClick={handleCopyMessageText}
              icon="copy"
              title={TEST_translate(
                selectedText ? 'Message.CopySelectedText' : 'Message.CopyText'
              )}
            />
          )}
          {canCopyImage && (
            <MenuItem icon="image" title={TEST_translate('Message.CopyImage')} />
          )}

          {isCopyable && <MenuDivider />}

          <MenuItem icon="reply">{TEST_translate('Reply')}</MenuItem>
          <MenuItem icon="pin">{TEST_translate('Pin')}</MenuItem>
          <MenuItem onClick={handleToggleEditing} icon="edit" title={TEST_translate('Edit')} />
          {/* hasText &&  */}

          <MenuItem icon="forward">{TEST_translate('Forward')}</MenuItem>
          <MenuItem icon="select" onClick={handleToggleSelection}>
            {TEST_translate('Select')}
          </MenuItem>
          {canDelete && (
            <MenuItem icon="delete" danger onClick={openDeleteModal}>
              {TEST_translate('Delete')}
            </MenuItem>
          )}
        </>
      )
    }

    return (
      <div
        ref={messageRef}
        data-mid={message.id}
        class={buildedClass}
        onContextMenu={(e) => {
          handleContextMenu(e)

          const el = e.target as HTMLElement

          const imageLikeTarget = (el.closest('.album-item') ||
            el.closest('.media-photo-container')) as HTMLElement | null
          const isImageTarget = Boolean(imageLikeTarget)
          const isHiddenWithSpoiler = el.className.includes('spoiler shown')

          if (!isImageTarget || isHiddenWithSpoiler) {
            return
          }

          imageLikeTarget!.style.filter = 'brightness(0.7)'
          contextMenuImgTarget.current = imageLikeTarget
          /**
           * @todo: переписати щоб знаходити САМЕ img element ???? і в ньому змінювати
           */
        }}
        onClick={
          hasMessageSelection
            ? (e) => {
                handleToggleSelection()
              }
            : undefined
        }
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
          {isAlbum && (
            <div class="album">
              {message.content.photos?.map((photo) => (
                <div class="album-item" key={photo.id}>
                  <Photo
                    lazy
                    withSpoiler={photo.withSpoiler}
                    alt=""
                    url={photo.url}
                    blurHash={photo.blurHash}
                    width={photo.width}
                    height={photo.height}
                  />
                </div>
              ))}
            </div>
          )}
          {hasOnePhoto && (
            <Photo
              lazy
              withSpoiler={message.content.photos![0]!.withSpoiler}
              alt=""
              url={message.content.photos![0]!.url}
              width={message.content.photos![0].width}
              height={message.content.photos![0].height}
              blurHash={message.content.photos![0].blurHash}
            />
          )}
          {hasDocument && <Document document={message.content.documents![0]!} />}
          {showSenderName && (
            <p class="bubble-content__sender">{senderName || 'USER NAME_UNDF'}</p>
          )}
          <p class="bubble-content__text">
            {messageText}
            {/* <h6>{message.orderedId}</h6> */}
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
          {renderMenuItems()}
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
export const VirtualScrollItem = memo(
  forwardRef<HTMLLIElement, CustomItemComponentProps>(({children, style}, ref) => {
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
  })
)
export const MessageBubble = memo(
  connect<OwnProps, StateProps>((state, ownProps) => {
    const chatId = ownProps.message.chatId
    const sender = ownProps.message.senderId
      ? selectUser(state, ownProps.message.senderId)
      : undefined

    const chat = selectChat(state, chatId)
    const isPrivateChat = isUserId(chatId)
    const showSenderName = Boolean(sender) && !ownProps.message?.isOutgoing && !isPrivateChat
    const chatMember = sender ? selectChatMember(state, chatId, sender.id) : undefined
    const selectedMessages = selectSelectedMessages(state, chatId)
    return {
      chat,
      sender,
      chatMember,
      hasMessageSelection: selectHasMessageSelection(state),
      isSelected: selectIsMessageSelected(state, ownProps.message.id),
      selectedMessages,
      showSenderName,
    }
  })(MessageBubbleImpl)
)
