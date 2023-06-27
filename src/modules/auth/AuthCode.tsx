import { FC, TargetedEvent, memo, useCallback } from 'preact/compat'
import { useSignal } from '@preact/signals'

import { AuthScreens } from 'types/state'

import { getGlobalState } from 'state/signal'
import { getActions } from 'state/action'
import { t } from 'lib/i18n'

import { InputText } from 'components/Input'
import { Spinner } from 'components/Spinner'

import './AuthCode.scss'
import { updateGlobalState } from 'state/persist'

const AuthCode: FC = () => {
  const { auth } = getGlobalState()
  const { verifyCode } = getActions()
  // const emojiRef = useRef<HTMLHeadingElement>(null)

  const handleChangeCode = async (e: TargetedEvent<HTMLInputElement, Event>) => {
    e.preventDefault()

    const { value } = e.currentTarget
    code.value = value
    if (auth.error) {
      auth.error = undefined
    }

    if (value.length === 6) {
      verifyCode(value)
    }
  }

  const handleEditPhone = useCallback(() => {
    updateGlobalState({
      auth: {
        screen: AuthScreens.PhoneNumber
      }
    })
  }, [])
  const code = useSignal('')

  return (
    <>
      {auth.loading && <Spinner size="large" color="primary" />}
      <h1 class="title">
        {auth.$phoneNumber}
        <i onClick={handleEditPhone} class="fa-solid fa-pencil" />
      </h1>
      <p class="subtitle">{t('Auth.CodeSendOnPhone')}</p>
      <InputText
        error={auth.error}
        maxLength={6}
        label={t('Code')}
        value={code.value}
        onInput={handleChangeCode}
      />
    </>
  )
}

export default memo(AuthCode)
