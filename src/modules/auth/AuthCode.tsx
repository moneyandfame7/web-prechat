import type {FC} from 'preact/compat'
import {memo, useCallback, useRef} from 'preact/compat'
import {useSignal} from '@preact/signals'

import {getGlobalState} from 'state/signal'
import {getActions} from 'state/action'
import {AuthScreens} from 'types/screens'

import {t} from 'lib/i18n'
import {generateRecaptcha} from 'lib/firebase'

import {Icon} from 'components/ui'
import {MonkeyTrack} from 'components/monkeys'
import {CodeInput} from 'components/ui/CodeInput'

import './AuthCode.scss'
import {appManager} from 'managers/manager'

const CODE_LENGTH = 6
const AuthCode: FC = () => {
  const {tempState} = appManager.appAuthManager
  const {verifyCode} = getActions()

  // const [code, setCode] = useState('')
  const code = useSignal('')
  const inputRef = useRef<HTMLInputElement>(null)

  const handleChangeCode = useCallback(
    (value: string) => {
      code.value = value
      if (tempState.error) {
        tempState.error = undefined
      }

      // if (value.length === 6) {
      //   // inputRef.current?.blur()  @commented to avoid flick monkey
      //   verifyCode(value)
      // }
    },
    [tempState.error]
  )
  // t('WrongNumber?')
  const handleEditPhone = () => {
    code.value = ''
    generateRecaptcha(tempState)

    // auth.screen = AuthScreens.PhoneNumber
    tempState.screen = AuthScreens.PhoneNumber
  }
  return (
    <>
      <MonkeyTrack
        inputRef={inputRef}
        size="medium"
        maxLength={CODE_LENGTH}
        currentLength={code.value.length}
      />
      <h1 class="title">
        {tempState.$phoneNumber}
        <div title={t('WrongNumber?')}>
          <Icon
            name="edit"
            color="secondary"
            height={24}
            width={24}
            onClick={handleEditPhone}
          />
        </div>
      </h1>
      <p class="subtitle">{t('Auth.CodeSendOnPhone')}</p>

      <CodeInput
        autoFocus
        error={tempState.error}
        isLoading={tempState.isLoading}
        onInput={handleChangeCode}
        value={code}
        cb={verifyCode}
        elRef={inputRef}
      />
    </>
  )
}

export default memo(AuthCode)
