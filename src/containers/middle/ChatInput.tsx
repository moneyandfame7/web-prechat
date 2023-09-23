import {useComputed, useSignal} from '@preact/signals'
import {type FC, memo, useCallback, useRef} from 'preact/compat'

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

  const buildedClass = clsx('chat-input', {
    'emoji-menu-shown': isEmojiMenuOpen,
  })

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
            onClick={toggleEmojiMenu}
          />
          <TextArea
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
