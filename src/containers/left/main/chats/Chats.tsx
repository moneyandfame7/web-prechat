import {useRef, type FC} from 'preact/compat'

import {Button, IconButton, InputText} from 'components/ui'
import {SwitchLanguageTest, ScreenManagerTest} from 'components/test'
import {MonkeyTrack} from 'components/monkeys'

import {useInputValue} from 'hooks'

import {useBoolean} from 'hooks/useFlag'
import {useTransition} from 'lib/css-transition'
import {t} from 'lib/i18n'

import './Chats.scss'
import {TEST_SIGNAL} from '../CreateChatButton'

export const Chats: FC = () => {
  const {value, handleInput} = useInputValue({initial: ''})
  const {value: boolean} = useBoolean(true)
  const inputRef = useRef<HTMLInputElement>(null)

  const testToggle = () => {
    if (TEST_SIGNAL.value) {
      TEST_SIGNAL.value = false
    } else {
      TEST_SIGNAL.value = true
    }
  }
  const TRANSITION_CLASS = useTransition({
    shouldRender: boolean,
    className: 'zoomFade',
    absoluted: true
  })

  return (
    <div>
      Chats {'   '}
      <ScreenManagerTest key="LP" />
      <IconButton icon="arrowLeft" />
      <SwitchLanguageTest />
      <MonkeyTrack
        inputRef={inputRef}
        size="medium"
        maxLength={12}
        currentLength={value.length}
      />
      <Button onClick={testToggle}>Toggle</Button>
      <InputText aria-label="Test" elRef={inputRef} value={value} onInput={handleInput} />
      {TRANSITION_CLASS}
      <div
        class={TRANSITION_CLASS}
        style={{
          width: 200,
          height: 200,
          backgroundColor: 'red'
        }}
      >
        Lorem ipsum
      </div>
      {t('Auth.CodeSendOnApp')}
      {t('NewPrivateChat')}
    </div>
  )
}
