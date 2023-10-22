import {useComputed, useSignal} from '@preact/signals'
import {type FC, memo, useCallback, useEffect, useRef} from 'preact/compat'

import clsx from 'clsx'

import type {ApiChat} from 'api/types'

import {getActions} from 'state/action'
import {connect} from 'state/connect'
import {isChatChannel, selectChat} from 'state/selectors/chats'
import {selectHasMessageSelection, selectMessagesSelectionCount} from 'state/selectors/diff'

import {useBoolean} from 'hooks/useFlag'

import {TEST_translate} from 'lib/i18n'

import {debounce} from 'common/functions'
import {parseMessageInput} from 'utilities/parse/parseMessageInput'
import {renderText} from 'utilities/parse/render'
import {insertTextAtCursor} from 'utilities/parse/selection'

import EmojiPicker from 'components/common/emoji-picker/EmojiPicker.async'
import DeleteMessagesModalAsync from 'components/popups/DeleteMessagesModal.async'
import {MenuItem} from 'components/popups/menu'
import {Transition} from 'components/transitions'
import {Button, Icon, IconButton} from 'components/ui'
import {DropdownMenu} from 'components/ui/DropdownMenu'
import {TextArea} from 'components/ui/TextArea'

import './ChatInput.scss'

interface OwnProps {
  chatId: string
  emojiMenuOpen: boolean
  onToggleEmojiMenu: VoidFunction
  onCloseEmojiMenu: VoidFunction
  isPinnedList: boolean | undefined
  hasPinnedMessages: boolean | undefined
}

interface StateProps {
  chat: ApiChat | undefined
  isChannel: boolean
  hasMessageSelection: boolean
  selectedMessagesCount: number
}
const debouncedSaveDraft = debounce((cb) => cb(), 5000, false)
const ChatInputImpl: FC<OwnProps & StateProps> = ({
  chatId,
  chat,
  emojiMenuOpen,
  onCloseEmojiMenu,
  onToggleEmojiMenu,
  isPinnedList,
  hasPinnedMessages,
  hasMessageSelection,
  selectedMessagesCount,
  isChannel,
}) => {
  const draft = chat?.draft
  const {sendMessage, saveDraft, toggleMessageSelection} = getActions()
  const inputRef = useRef<HTMLDivElement>(null)

  const inputHtml = useSignal(draft || '')
  const isSendDisabled = useComputed(() => inputHtml.value.length === 0)
  const changeInputHtml = (html: string) => {
    inputHtml.value = html

    void debouncedSaveDraft(() => {
      const parsed = parseMessageInput(inputHtml.value)

      if (!parsed.text.length) {
        saveDraft({
          text: undefined,
          chatId,
        })
        return
      }

      saveDraft({
        text: parsed.text,
        chatId,
      })
    })
  }

  useEffect(() => {
    inputHtml.value = draft || ''
  }, [draft])

  const insertInCursor = (text: string) => {
    const replaced = renderText([text], ['emoji_html']).join(' ')

    insertTextAtCursor(replaced, inputRef)
  }

  const inputFocused = useSignal(false)

  const handleToggleEmojiMenu = useCallback(() => {
    onToggleEmojiMenu()
    inputRef.current?.focus()
  }, [])
  const buildedClass = clsx('chat-input', {
    'emoji-menu-shown': emojiMenuOpen,
  })
  // useLayoutEffect(() => {
  //   inputFocused.value = true
  // }, [])

  // eslint-disable-next-line arrow-body-style
  useEffect(() => {
    /**
     * Nothing interesting.
     */
    return () => {
      if (inputHtml.value.trim().length) {
        const parsed = parseMessageInput(inputHtml.value)
        saveDraft({
          chatId,
          text: parsed.text,
        })
      }
    }
  }, [])

  // idk how to prevent on other elements
  // useEffect(() => {
  //   const handleKeydown = (e: KeyboardEvent) => {
  //     const selection = window.getSelection()
  //     if (!selection?.rangeCount) return

  //     const range = selection.getRangeAt(0)
  //     // if (range.startContainer === in.current) {
  //     //   divRef.current.focus();
  //     // }
  //     //
  //     console.log(range.startContainer)
  //     // if (e.metaKey || inputFocused.value || IGNORED_KEY_CODES_FOR_FOCUS.includes(e.key)) {
  //     //   return
  //     // }

  //     // if (e.key === 'Enter') {
  //     //   console.log('SUBMIT?')
  //     //   return
  //     // } else if (e.key === 'Backspace') {
  //     //   inputHtml.value = inputHtml.value.slice(0, -1)
  //     //   inputFocused.value = true
  //     //   insertCursorAtEnd(inputRef)

  //     //   return
  //     // }
  //     // e.preventDefault()
  //     // inputFocused.value = true
  //     // inputHtml.value += e.key
  //     // insertCursorAtEnd(inputRef)
  //   }

  //   document.addEventListener('keydown', handleKeydown)

  //   return () => {
  //     document.removeEventListener('keydown', handleKeydown)
  //   }
  // }, [])
  const handleSend = useCallback(() => {
    if (!inputHtml.value.length) {
      return
    }
    const {text, entities} = parseMessageInput(inputHtml.value)

    sendMessage({text, entities, chatId})
    saveDraft({text: undefined, chatId})
    inputHtml.value = ''
  }, [])

  const transitionKey = hasMessageSelection ? 1 : 0
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
      case 0:
        return (
          <>
            <IconButton
              icon={emojiMenuOpen ? 'keyboard' : 'smile'}
              onClick={handleToggleEmojiMenu}
            />
            <TextArea
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
              <MenuItem icon="image">Photo or Video</MenuItem>
              <MenuItem icon="document">Document</MenuItem>
            </DropdownMenu>
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
      case 1:
        return (
          <div class="selection-container">
            <div class="selection-container-left">
              <IconButton icon="close" onClick={handleCloseSelection} />
              {TEST_translate('MessagesCount', {count: selectedMessagesCount})}
            </div>
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
          </div>
        )
    }
  }
  console.log('RERENDER!!!??!?!?')
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
            <Button onClick={handleSend} isDisabled={isSendDisabled} className="send-button">
              <Icon name="send" />
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
      <DeleteMessagesModalAsync
        chat={chat}
        onClose={closeDeleteModal}
        isOpen={isDeleteModalOpen}
      />
    </div>
  )
}

export const ChatInput = memo(
  connect<OwnProps, StateProps>((state, ownProps) => {
    const chat = selectChat(state, ownProps.chatId)
    return {
      chat,
      isChannel: Boolean(chat && isChatChannel(chat)),
      hasMessageSelection: selectHasMessageSelection(state),
      selectedMessagesCount: selectMessagesSelectionCount(state),
    }
  })(ChatInputImpl)
)
