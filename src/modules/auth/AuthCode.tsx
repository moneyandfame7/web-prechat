import type {FC, TargetedEvent} from 'preact/compat'
import {memo, useRef} from 'preact/compat'
import {useSignal} from '@preact/signals'

import {getGlobalState} from 'state/signal'
import {getActions} from 'state/action'
import {AuthScreens} from 'types/screens'

import {t} from 'lib/i18n'

import {InputText, Icon} from 'components/ui'
import {MonkeyTrack} from 'components/monkeys'

import {generateRecaptcha} from 'lib/firebase'

import './AuthCode.scss'

const CODE_LENGTH = 6
const AuthCode: FC = () => {
  const {auth} = getGlobalState()
  const {verifyCode} = getActions()

  // const [code, setCode] = useState('')
  const code = useSignal('')
  const inputRef = useRef<HTMLInputElement>(null)

  const handleChangeCode = async (e: TargetedEvent<HTMLInputElement, Event>) => {
    e.preventDefault()

    const {value} = e.currentTarget
    // setCode(value)
    code.value = value
    if (auth.error) {
      auth.error = undefined
    }

    if (value.length === 6) {
      // inputRef.current?.blur()  @commented to avoid flick monkey
      verifyCode(value)
    }
  }
  // t('WrongNumber?')
  const handleEditPhone = () => {
    code.value = ''
    generateRecaptcha(auth)
    auth.screen = AuthScreens.PhoneNumber
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
        {auth.$phoneNumber}
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
      <InputText
        inputMode="decimal"
        type="tel"
        elRef={inputRef}
        autoFocus
        error={auth.error}
        maxLength={CODE_LENGTH}
        label={t('Code')}
        value={code}
        loading={auth.isLoading}
        onInput={handleChangeCode}
      />
      {/* {auth.loading && <Spinner size="large" />} */}
    </>
  )
}

export default memo(AuthCode)
