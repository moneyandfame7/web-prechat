import { FC, memo } from 'preact/compat'

import { useSignal } from '@preact/signals'

import { LanguageSwitch } from 'components'
import 'state/global/actions/imporant'
import { t } from 'state/i18n'

import AuthCode from './AuthCode.async'
import AuthPassword from './AuthPassword.async'
import AuthPhoneNumber from './AuthPhoneNumber'
import SignUp from './SignUp'
import './auth.scss'

enum AuthScreens {
  PhoneNumber = 'PhoneNumber',
  Password = 'AuthPassword',
  Code = 'Code',
  SignUp = 'SignUp'
}
const Auth: FC = () => {
  const activeScreen = useSignal(AuthScreens.PhoneNumber)

  const renderScreen = () => {
    switch (activeScreen.value) {
      case AuthScreens.PhoneNumber:
        return <AuthPhoneNumber />
      case AuthScreens.Code:
        return <AuthCode />
      case AuthScreens.Password:
        return <AuthPassword />
      case AuthScreens.SignUp:
        return <SignUp />
    }
  }
  return (
    <div className="Auth">
      <LanguageSwitch />
      <h1>{t('Hello')}</h1>
      {renderScreen()}
    </div>
  )
}

export default memo(Auth)
