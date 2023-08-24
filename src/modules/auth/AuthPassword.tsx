import type {FC} from 'preact/compat'
import {memo, useCallback} from 'preact/compat'
import {useSignal} from '@preact/signals'

import {getGlobalState} from 'state/signal'

import {t} from 'lib/i18n'

import {Button, PasswordInput} from 'components/ui'
import {MonkeyPassword} from 'components/monkeys'

const AuthPassword: FC = () => {
  const {auth} = getGlobalState()
  // const authState = authStore.getState()
  const password = useSignal('')
  const showPassword = useSignal(false)

  const handleChange = useCallback((value: string) => {
    password.value = value
  }, [])

  return (
    <>
      <MonkeyPassword see={showPassword} />
      <h1 class="title">Enter a Password</h1>
      <p class="subtitle">Your account is protected with an additional password.</p>
      <PasswordInput
        disabled={auth.$isLoading}
        value={password}
        onInput={handleChange}
        label="Password"
        showPassword={showPassword}
      />
      <Button isLoading={auth.isLoading}>{t('Next')}</Button>
    </>
  )
}
export default memo(AuthPassword)
