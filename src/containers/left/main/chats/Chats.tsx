import {useRef, type FC, useEffect} from 'preact/compat'

import {Button, IconButton, InputText} from 'components/ui'
import {SwitchLanguageTest, ScreenManagerTest} from 'components/test'
import {MonkeyTrack} from 'components/monkeys'

import {useInputValue} from 'hooks'

import {useBoolean} from 'hooks/useFlag'
import {useTransition} from 'lib/css-transition'

import './Chats.scss'
import {useSubscription} from '@apollo/client'
import {SUBSCRIBE_TEST} from 'api/graphql'
import {testMutation, testSubscribe} from 'api/methods'

export const Chats: FC = () => {
  const {value, handleInput} = useInputValue({initial: ''})
  const {value: boolean, setTrue, setFalse} = useBoolean(true)
  const inputRef = useRef<HTMLInputElement>(null)

  const TRANSITION_CLASS = useTransition({
    shouldRender: boolean,
    className: 'zoomFade',
    absoluted: true
  })

  // console.log({TRANSITION_CLASS})
  // const {data} = useSubscription(SUBSCRIBE_TEST, {})
  // useEffect(() => {
  //   ;(async () => {
  //     await testSubscribe()
  //   })()
  // }, [])

  useEffect(() => {
    testSubscribe()
  }, [])
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
      <InputText
        aria-label="Test"
        elRef={inputRef}
        value={value}
        onInput={handleInput}
      />
      <Button
        onClick={() => {
          testMutation(crypto.randomUUID() + Date.now())
        }}
      >
        Mutate
      </Button>
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
    </div>
  )
}
