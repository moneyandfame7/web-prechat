import {useComputed, useSignal} from '@preact/signals'
import {type FC, memo, useCallback, useEffect, useRef} from 'preact/compat'

import clsx from 'clsx'

import {getActions} from 'state/action'
import {connect} from 'state/connect'
import {selectChat} from 'state/selectors/chats'

import {useBoolean} from 'hooks/useFlag'

import {debounce} from 'common/functions'
import {parseMessageInput} from 'utilities/parse/parseMessageInput'
import {renderText} from 'utilities/parse/render'
import {insertTextAtCursor} from 'utilities/parse/selection'

import EmojiPicker from 'components/common/emoji-picker/EmojiPicker.async'
import {MenuItem} from 'components/popups/menu'
import {Button, Icon, IconButton} from 'components/ui'
import {DropdownMenu} from 'components/ui/DropdownMenu'
import {TextArea} from 'components/ui/TextArea'

import './ChatInput.scss'

interface OwnProps {
  chatId: string
  emojiMenuOpen: boolean
  onToggleEmojiMenu: VoidFunction
  onCloseEmojiMenu: VoidFunction
}

interface StateProps {
  draft?: string
}
const debouncedSaveDraft = debounce((cb) => cb(), 5000, false)
const ChatInputImpl: FC<OwnProps & StateProps> = ({
  chatId,
  draft,
  emojiMenuOpen,
  onCloseEmojiMenu,
  onToggleEmojiMenu,
}) => {
  const {sendMessage, saveDraft} = getActions()
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

  return (
    <div class={buildedClass}>
      <div class="chat-input-container">
        <div class="input-message">
          <IconButton
            icon={emojiMenuOpen ? 'keyboard' : 'smile'}
            onClick={handleToggleEmojiMenu}
          />
          <TextArea
            isFocused={inputFocused}
            placeholder={'Message'}
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
        </div>
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
    </div>
  )
}

export const ChatInput = memo(
  connect<OwnProps, StateProps>((state, ownProps) => ({
    draft: selectChat(state, ownProps.chatId)?.draft,
  }))(ChatInputImpl)
)
