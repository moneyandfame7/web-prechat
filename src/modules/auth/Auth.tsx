import { FC, memo } from 'preact/compat'

import { useSignal } from '@preact/signals'

import { Button } from 'components/Button'
import { MountTransition } from 'components/MountTransition'
import { Transition, TransitionType } from 'components/Transition'
import 'state/global/actions/imporant'

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
        return <AuthPhoneNumber key={AuthScreens.PhoneNumber} />
      case AuthScreens.Code:
        return <AuthCode key={AuthScreens.Code} />
      case AuthScreens.Password:
        return <AuthPassword key={AuthScreens.Password} />
      case AuthScreens.SignUp:
        return <SignUp key={AuthScreens.SignUp} />
    }
  }
  const getAnimationName = (): TransitionType => {
    switch (activeScreen.value) {
      case AuthScreens.PhoneNumber:
      case AuthScreens.Code:
        return 'zoomSlide'
      default:
        return 'zoomSlideReverse'
    }
  }
  return (
    <div class="scrollable">
      <Button
        onClick={() => {
          console.log('TI DAUN')
          activeScreen.value = AuthScreens.Code
        }}
      >
        Code
      </Button>
      <Button
        onClick={() => {
          activeScreen.value = AuthScreens.Password
        }}
      >
        pass
      </Button>
      <Button
        onClick={() => {
          activeScreen.value = AuthScreens.PhoneNumber
        }}
      >
        Phone
      </Button>
      <Button
        onClick={() => {
          activeScreen.value = AuthScreens.SignUp
        }}
      >
        sign
      </Button>
      <div class="Auth">
        <div class="Auth_inner">
          <MountTransition activeKey={activeScreen.value} shouldCleanup name="fade" initial={false}>
            {renderScreen()}
          </MountTransition>
        </div>
      </div>
    </div>
  )
}

export default memo(Auth)
