import {useComputed, useSignal} from '@preact/signals'
import {type FC, memo, useCallback, useLayoutEffect, useRef} from 'preact/compat'

import clsx from 'clsx'

import {getActions} from 'state/action'

import {useBoolean} from 'hooks/useFlag'

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
}
const ChatInputImpl: FC<OwnProps> = ({chatId}) => {
  const {sendMessage} = getActions()
  const inputRef = useRef<HTMLDivElement>(null)

  const inputHtml = useSignal('')
  const isSendDisabled = useComputed(() => inputHtml.value.length === 0)
  const changeInputHtml = (html: string) => {
    inputHtml.value = html
  }

  const insertInCursor = (text: string) => {
    const replaced = renderText([text], ['emoji_html']).join(' ')

    insertTextAtCursor(replaced, inputRef)
  }

  const {
    value: isEmojiMenuOpen,
    toggle: toggleEmojiMenu,
    setFalse: closeEmojiMenu,
  } = useBoolean()
  const inputFocused = useSignal(false)

  const handleToggleEmojiMenu = useCallback(() => {
    toggleEmojiMenu()
    inputRef.current?.focus()
  }, [])
  const buildedClass = clsx('chat-input', {
    'emoji-menu-shown': isEmojiMenuOpen,
  })
  useLayoutEffect(() => {
    inputFocused.value = true
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
    const {text, entities} = parseMessageInput(inputHtml.value)

    sendMessage({text, entities, chatId})
    inputHtml.value = ''
  }, [])

  return (
    <div class={buildedClass}>
      <div class="chat-input-container">
        <div class="input-message">
          <IconButton
            icon={isEmojiMenuOpen ? 'keyboard' : 'smile'}
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
        </div>
        <Button onClick={handleSend} isDisabled={isSendDisabled} className="send-button">
          <Icon name="send" />
        </Button>
      </div>

      <EmojiPicker
        onClose={closeEmojiMenu}
        isOpen={isEmojiMenuOpen}
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

// const mapStateToProps: MapState<OwnProps, StateProps> = (state) => {
//   return {
//     currentChatId: state.currentChat.chatId,
//   }
// }
export const ChatInput = memo(ChatInputImpl)
