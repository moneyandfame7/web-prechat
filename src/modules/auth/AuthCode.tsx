import type {FC} from 'preact/compat'
import {memo, useCallback, useRef} from 'preact/compat'
import {useSignal} from '@preact/signals'

import {AuthScreens} from 'types/screens'

import {combinedStore} from 'store/combined'

import {t} from 'lib/i18n'
import {generateRecaptcha} from 'lib/firebase'

import {Icon} from 'components/ui'
import {MonkeyTrack} from 'components/monkeys'
import {CodeInput} from 'components/ui/CodeInput'

import './AuthCode.scss'

const CODE_LENGTH = 6
const AuthCode: FC = () => {
  const {auth: authState} = combinedStore.getState()
  const appActions = combinedStore.getActions()
  // const {verifyCode} = getActions()

  // const [code, setCode] = useState('')
  const code = useSignal('')
  const inputRef = useRef<HTMLInputElement>(null)

  const handleChangeCode = useCallback(
    (value: string) => {
      code.value = value
      if (authState.error) {
        authState.error = undefined
      }
    },
    [authState.error]
  )
  // t('WrongNumber?')
  const handleEditPhone = () => {
    code.value = ''
    generateRecaptcha(authState)

    // auth.screen = AuthScreens.PhoneNumber
    authState.screen = AuthScreens.PhoneNumber
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
        {authState.$phoneNumber}
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
        error={authState.error}
        isLoading={authState.isLoading}
        onInput={handleChangeCode}
        value={code}
        cb={appActions.auth.verifyCode}
        elRef={inputRef}
      />
    </>
  )
}

export default memo(AuthCode)
