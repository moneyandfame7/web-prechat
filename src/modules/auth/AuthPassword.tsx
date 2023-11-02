import {useSignal} from '@preact/signals'
import {type FC, memo, useCallback} from 'preact/compat'

import {getGlobalState} from 'state/signal'

import {TEST_translate} from 'lib/i18n'

import {MonkeyPassword} from 'components/monkeys'
import {Button, PasswordInput} from 'components/ui'

const AuthPassword: FC = () => {
  const {auth} = getGlobalState()
  // const authState = authStore.getState()
  const password = useSignal('')
  const showPassword = useSignal(false)

  const handleChange = useCallback((value: string) => {
    password.value = value
  }, [])

  return (
    <div class="Auth_password">
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
      <Button isLoading={auth.isLoading}>{TEST_translate('Next')}</Button>
    </div>
  )
}
export default memo(AuthPassword)
