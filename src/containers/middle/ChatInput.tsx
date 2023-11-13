import {useSignal} from '@preact/signals'
import {
  ChangeEvent,
  type FC,
  type RefObject,
  TargetedEvent,
  memo,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'preact/compat'

import clsx from 'clsx'
import type {VListHandle} from 'virtua'

import {Api} from 'api/manager'
import type {ApiChat, ApiMessage} from 'api/types'

import {getActions} from 'state/action'
import {connect} from 'state/connect'
import {isUserId} from 'state/helpers/users'
import {isChatChannel, selectChat} from 'state/selectors/chats'
import {
  selectHasMessageEditing,
  selectHasMessageSelection,
  selectMessagesSelectionCount,
} from 'state/selectors/diff'
import {selectMessage} from 'state/selectors/messages'

import {useBoolean} from 'hooks/useFlag'

import {TEST_translate} from 'lib/i18n'

import {MODAL_TRANSITION_MS} from 'common/environment'
import {getBlobUrl} from 'utilities/file/getBlobUrl'
import {getImageDimension} from 'utilities/file/getImageDimension'
import {MyFileList} from 'utilities/fileList'
import {getImagePreview} from 'utilities/getImagePreview'
import {parseMessageInput} from 'utilities/parse/parseMessageInput'
import {renderText} from 'utilities/parse/render'
import {insertCursorAtEnd, insertTextAtCursor} from 'utilities/parse/selection'

import EmojiPicker from 'components/common/emoji-picker/EmojiPicker.async'
import DeleteMessagesModalAsync from 'components/popups/DeleteMessagesModal.async'
import type {MediaItem, MediaOptions} from 'components/popups/SendMediaModal'
import SendMediaModal from 'components/popups/SendMediaModal.async'
import {MenuItem} from 'components/popups/menu'
import {SingleTransition, Transition} from 'components/transitions'
import {Button, Icon, IconButton} from 'components/ui'
import {DropdownMenu} from 'components/ui/DropdownMenu'
import {TextArea} from 'components/ui/TextArea'

import {MessageHelper} from './message/MessageHelper'

import './ChatInput.scss'

interface OwnProps {
  chatId: string
  emojiMenuOpen: boolean
  onToggleEmojiMenu: VoidFunction
  onCloseEmojiMenu: VoidFunction
  isPinnedList: boolean | undefined
  hasPinnedMessages: boolean | undefined
  infiniteScrollRef: RefObject<VListHandle>
}

interface StateProps {
  chat: ApiChat | undefined
  editableMessage: ApiMessage | undefined
  isChannel: boolean
  hasMessageEditing: boolean
  hasMessageSelection: boolean
  selectedMessagesCount: number
}
enum InputContent {
  Main,
  Selection,
  Editing,
}
const ChatInputImpl: FC<OwnProps & StateProps> = ({
  chatId,
  chat,
  editableMessage,
  emojiMenuOpen,
  onCloseEmojiMenu,
  onToggleEmojiMenu,
  isPinnedList,
  hasMessageEditing,
  hasPinnedMessages,
  hasMessageSelection,
  selectedMessagesCount,
  isChannel,
  infiniteScrollRef,
}) => {
  const {sendMessage, editMessage, toggleMessageSelection} = getActions()
  const inputRef = useRef<HTMLDivElement>(null)
  const inputImageRef = useRef<HTMLInputElement>(null)
  const inputDocumentRef = useRef<HTMLInputElement>(null)

  const {
    value: sendMediaModalOpen,
    setFalse: closeSendMediaModal,
    setTrue: openSendMediaModal,
  } = useBoolean()

  const [mediaItems, setMediaItems] = useState<MediaItem[]>([])
  const [mediaOptions, setMediaOptions] = useState<MediaOptions>({
    groupAllMedia: true,
    sendAsFiles: false,
  })

  const handleCloseSendMediaModal = () => {
    closeSendMediaModal()
    setTimeout(() => {
      setMediaItems((prev) => {
        prev.forEach((item) => {
          if (item.previewUrl) {
            URL.revokeObjectURL(item.previewUrl)
          }
        })
        return []
      })
    }, MODAL_TRANSITION_MS)
  }

  const inputHtml = useSignal(/* draft || */ '')
  const isSendDisabled =
    /*  useComputed(() => */ // not rerender hasMessageEditing because it's memoized
    hasMessageEditing ? false : inputHtml.value.length === 0
  // )

  const changeInputHtml = (html: string) => {
    inputHtml.value = html
  }

  const triggerAddImage = () => {
    inputImageRef.current?.click()
    // openSendMediaModal()
  }
  const triggerAddDocument = () => {
    inputDocumentRef.current?.click()
  }
  const handleAddImage = async (e: TargetedEvent<HTMLInputElement, ChangeEvent>) => {
    const files = e.currentTarget.files

    if (!files) {
      return
    }

    const promises: Promise<MediaItem>[] = [...files].map(async (file) => {
      const isImage = file.type.startsWith('image/')
      const id = crypto.randomUUID()
      const blobUrl = getBlobUrl(file)
      const dimension = await getImageDimension(blobUrl)

      return {
        id,
        file: new File([file], `${id}_${file.name}`), // ВАЖЛИВО робити саме таке
        dimension,
        isImage,
        withSpoiler: false,
        previewUrl: blobUrl,
        mimeType: file.name.split('.').pop()?.toLowerCase(),

        // ...dimension,
      } satisfies MediaItem
    })
    const newMediaItems = await Promise.all(promises)

    setMediaItems((prev) => [...newMediaItems, ...prev])
    if (!sendMediaModalOpen) {
      openSendMediaModal()
    }
  }

  const handleAddDocument = (e: TargetedEvent<HTMLInputElement, ChangeEvent>) => {
    const files = e.currentTarget.files
    if (!files) {
      return
    }

    const newMediaItems: MediaItem[] = []
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      const mimeType = file.name.split('.').pop()?.toLowerCase()
      if (!mimeType) {
        continue
      }
      const id = crypto.randomUUID()
      const isImage = file.type.startsWith('image/')

      newMediaItems.push({
        id,
        mimeType,
        file: new File([file], `${id}_${file.name}`),
        isImage,
        withSpoiler: false,
        previewUrl: isImage ? getImagePreview(file) : undefined,
      })
    }
    console.log({newMediaItems})
    setMediaItems((prev) => [...newMediaItems, ...prev])

    if (!sendMediaModalOpen) {
      openSendMediaModal()
    }
  }

  useEffect(() => {
    if (hasMessageEditing) {
      // inputHtml.value = editableMessage?.text
      // inputFocused.value = true
      editableMessage?.text && changeInputHtml(editableMessage.text)
      inputFocused.value = true
      insertCursorAtEnd(inputRef)
    } else {
      changeInputHtml('')
    }
  }, [hasMessageEditing, editableMessage])

  useEffect(() => {
    if (mediaItems.length === 0 && sendMediaModalOpen) {
      closeSendMediaModal()
    }
  }, [mediaItems, sendMediaModalOpen])
  const insertInCursor = (text: string) => {
    const replaced = renderText([text], ['emoji_html']).join(' ')

    insertTextAtCursor(replaced, inputRef)
  }

  const inputFocused = useSignal(false)

  const handleToggleEmojiMenu = useCallback(() => {
    onToggleEmojiMenu()
    inputRef.current?.focus()
  }, [])
  const isInputHelperActive = hasMessageEditing // isReply..
  const buildedClass = clsx('chat-input', {
    'emoji-menu-shown': emojiMenuOpen,
    'is-helper-active': isInputHelperActive,
  })

  const handleSubmit = useCallback(async () => {
    if (hasMessageEditing && editableMessage) {
      if (!inputHtml.value.length) {
        openDeleteModal()
      } else {
        await editMessage({text: inputHtml.value, chatId, messageId: editableMessage.id})
        inputHtml.value = ''
      }
    } else {
      const {text, entities} = parseMessageInput(inputHtml.value)

      sendMessage({text, entities /* chatId */})
      inputHtml.value = ''
    }
  }, [hasMessageEditing, editableMessage])

  const handleGoDown = useCallback(() => {
    if (!infiniteScrollRef.current) {
      return
    }
    infiniteScrollRef.current.scrollBy(infiniteScrollRef.current.scrollSize)
  }, [])

  const transitionKey = hasMessageSelection ? 1 : 0
  const sendButtonTransitionKey = hasMessageEditing ? 1 : 0
  const {
    value: isDeleteModalOpen,
    setTrue: openDeleteModal,
    setFalse: closeDeleteModal,
  } = useBoolean(false)

  const handleCloseSelection = useCallback(() => {
    toggleMessageSelection({active: false})
  }, [])

  function renderChatInput() {
    switch (transitionKey) {
      case 0: {
        const canSharePoll = chat && !isUserId(chat.id)
        return (
          <>
            <SingleTransition
              toggle
              timeout={0}
              className="message-helper-container"
              in={hasMessageEditing}
              name="slideFadeY"
            >
              <MessageHelper chatId={chatId} />
            </SingleTransition>

            <IconButton
              icon={emojiMenuOpen ? 'keyboard' : 'smile'}
              onClick={handleToggleEmojiMenu}
            />
            <TextArea
              isInputHelperActive={isInputHelperActive}
              isFocused={inputFocused}
              placeholder={TEST_translate(isChannel ? 'Broadcast' : 'Message')}
              onChange={changeInputHtml}
              html={inputHtml}
              inputRef={inputRef}
            />

            <DropdownMenu
              placement={{
                bottom: true,
                right: true,
              }}
              transform="bottom right"
              button={<IconButton icon="attach" />}
            >
              <MenuItem
                onClick={triggerAddImage}
                icon="image"
                title={TEST_translate('Chat.Attach.PhotoOrVideo')}
              />
              <input
                onChange={handleAddImage}
                style={{display: 'none'}}
                ref={inputImageRef}
                multiple
                type="file"
                accept="image/*, video/*"
              />
              <MenuItem
                icon="document"
                title={TEST_translate('Chat.Attach.Document')}
                onClick={triggerAddDocument}
              />
              <input
                onChange={handleAddDocument}
                style={{display: 'none'}}
                ref={inputDocumentRef}
                multiple
                type="file"
                // accept="image/*, video/*"
              />
              <MenuItem title={TEST_translate('Chat.Attach.Contact')} icon="user" />
              {canSharePoll && (
                <MenuItem title={TEST_translate('Chat.Attach.Poll')} icon="poll" />
              )}
            </DropdownMenu>

            <SendMediaModal
              isOpen={sendMediaModalOpen}
              onClose={handleCloseSendMediaModal}
              items={mediaItems}
              setItems={setMediaItems}
              options={mediaOptions}
              setOptions={setMediaOptions}
              triggerAddDocument={triggerAddDocument}
            />
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
          </>
        )
      }
      case 1:
        return (
          <div class="selection-container">
            <div class="selection-container-left">
              <IconButton icon="close" onClick={handleCloseSelection} />
              {TEST_translate('MessagesCount', {count: selectedMessagesCount})}
            </div>
            {Boolean(selectedMessagesCount) && (
              <div class="selection-container-right">
                <Button
                  uppercase={false}
                  shape="rounded"
                  fullWidth={false}
                  color="gray"
                  variant="transparent"
                  iconPosition="start"
                  icon="forward"
                >
                  {TEST_translate('Forward')}
                </Button>
                <Button
                  onClick={openDeleteModal}
                  uppercase={false}
                  shape="rounded"
                  fullWidth={false}
                  color="red"
                  variant="transparent"
                  iconPosition="start"
                  icon="delete"
                >
                  {TEST_translate('Delete')}
                </Button>
              </div>
            )}
          </div>
        )
    }
  }
  function renderSendBtnIcon() {
    switch (sendButtonTransitionKey) {
      case 0:
        return <Icon name="send" />
      case 1:
        return <Icon name="check" />
    }
  }
  return (
    <div class={buildedClass}>
      {/* maybe just opacity 0,1? */}
      {!isPinnedList ? (
        <>
          <div class="chat-input-container">
            <Transition
              // timeout={550}
              innerClassnames={{
                0: 'input-message',
                1: 'selection-wrapper',
              }}
              name="fade"
              activeKey={transitionKey}
            >
              {renderChatInput()}
            </Transition>
            <Button onClick={handleSubmit} isDisabled={isSendDisabled} className="send-button">
              <Transition name="zoomIcon" activeKey={sendButtonTransitionKey}>
                {renderSendBtnIcon()}
              </Transition>
              {/* <Icon name="send" /> */}
            </Button>
          </div>

          <EmojiPicker
            onClose={onCloseEmojiMenu}
            isOpen={emojiMenuOpen}
            onSelectEmoji={(e) => {
              insertInCursor(e.native)
            }}
            onChangeSkin={(skin) => {
              console.log({skin})
            }}
          />
        </>
      ) : (
        hasPinnedMessages && (
          <Button uppercase={false} shape="rounded" fullWidth={false}>
            {TEST_translate('UnpinAllMessages')}
          </Button>
        )
      )}
      {/* {!m} */}
      <Button
        onClick={handleGoDown}
        badge={chat?.unreadCount || undefined}
        className="btn-go-down"
        shape="circle"
        icon="arrowDown"
        color="gray"
      />

      <DeleteMessagesModalAsync
        chat={chat}
        onClose={closeDeleteModal}
        isOpen={isDeleteModalOpen}
        message={editableMessage}
      />
    </div>
  )
}

export const ChatInput = memo(
  connect<OwnProps, StateProps>((state, ownProps) => {
    const chat = selectChat(state, ownProps.chatId)
    // const isChatEmpty
    const messageEditing = state.messageEditing
    const editableMessage = messageEditing.messageId
      ? selectMessage(state, ownProps.chatId, messageEditing.messageId)
      : undefined
    // const openedChat = openedChats[openedChats.length - 1] as OpenedChat | undefined
    return {
      chat,
      editableMessage,
      isChannel: Boolean(chat && isChatChannel(chat)),
      hasMessageEditing: selectHasMessageEditing(state),
      hasMessageSelection: selectHasMessageSelection(state),
      selectedMessagesCount: selectMessagesSelectionCount(state),
    }
  })(ChatInputImpl)
)
