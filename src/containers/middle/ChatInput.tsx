import {useComputed, useSignal} from '@preact/signals'
import {type FC, memo, useCallback, useRef} from 'preact/compat'

import clsx from 'clsx'

import {getActions} from 'state/action'

import {useBoolean} from 'hooks/useFlag'

import {parseMessageInput} from 'utilities/parse/parseMessageInput'
import {renderText} from 'utilities/parse/render'
import {replaceEmojis} from 'utilities/parse/replaceEmojis'
import {insertTextAtCursor} from 'utilities/parse/selection'

import EmojiPicker from 'components/common/emoji-picker/EmojiPicker.async'
import {Button, Icon, IconButton} from 'components/ui'
import {TextArea} from 'components/ui/TextArea'

import './ChatInput.scss'

interface OwnProps {
  chatId: string
}
const ChatInputImpl: FC<OwnProps> = ({chatId}) => {
  const {sendMessage} = getActions()
  const inputRef = useRef<HTMLDivElement>(null)
  const {
    value: inputFocused,
    setFalse: unmarkInputFocused,
    setTrue: markInputFocused,
  } = useBoolean()

  const inputHtml = useSignal('')
  const isSendDisabled = useComputed(() => inputHtml.value.length === 0)
  const changeInputHtml = (html: string) => {
    inputHtml.value = html
  }
  const insertInCursor = (text: string) => {
    const replaced = renderText([text], ['emoji_html']).join(' ')

    insertTextAtCursor(replaced, inputRef)

    console.log(inputHtml.value, 'AFTER INSERT:')
  }
  const {value: isEmojiMenuOpen, toggle: toggleEmojiMenu} = useBoolean()

  const buildedClass = clsx('chat-input', {
    'emoji-menu-shown': isEmojiMenuOpen,
  })

  const handleSend = useCallback(() => {
    const {text, entities} = parseMessageInput(inputHtml.value)

    console.log(text, entities, inputHtml.value)

    sendMessage({text, entities, chatId})
    inputHtml.value = ''
  }, [])

  const isGloballyInputHasFocus = isEmojiMenuOpen || inputFocused

  return (
    <div class={buildedClass}>
      <div class="chat-input-container">
        <div class="input-message">
          <IconButton
            icon={isEmojiMenuOpen ? 'keyboard' : 'smile'}
            onClick={toggleEmojiMenu}
          />
          <TextArea onChange={changeInputHtml} html={inputHtml} inputRef={inputRef} />
          {/* <div
            className={clsx('chat-input-inner', {
              'is-empty': inputHtml.value.length === 0,
            })}
          >
            <div data-placeholder="Message" class="input-field-fake" />

            <input
              // value={value}
              onInput={handleChange}
              placeholder="daun"
              class="input-field"
            />
          </div> */}
          <IconButton icon="attach" />
        </div>
        <Button onClick={handleSend} isDisabled={isSendDisabled} className="send-button">
          {/* L */}
          <Icon name="send" />
        </Button>
      </div>

      <EmojiPicker
        isOpen={isEmojiMenuOpen}
        onSelectEmoji={(e) => {
          insertInCursor(e.native)
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
