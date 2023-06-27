import { VNode } from 'preact'
import { FC, memo, useCallback, useEffect } from 'preact/compat'

import 'state/actions/imporant'
import { initializeAuth } from 'state/initialize'
import { getGlobalState } from 'state/signal'

import { AuthScreens } from 'types/state'

import { MountTransition } from 'components/MountTransition'
import { TransitionType } from 'components/Transition'

import SignUp from './SignUp.async'
import AuthCode from './AuthCode.async'
import AuthPassword from './AuthPassword.async'
import AuthPhoneNumber from './AuthPhoneNumber'

const classNames = {
  [AuthScreens.Code]: 'Auth_code',
  [AuthScreens.Password]: 'Auth_password',
  [AuthScreens.PhoneNumber]: 'Auth_phone',
  [AuthScreens.SignUp]: 'Auth_signup'
}
function getAuthScreenTransition(newEl: VNode, current: VNode): TransitionType {
  // console.log(current, newEl)
  if (current.key === AuthScreens.PhoneNumber && newEl.key === AuthScreens.Code) {
    return 'zoomSlide'
  } else if (current.key === AuthScreens.Code && newEl.key === AuthScreens.PhoneNumber) {
    return 'zoomSlideReverse'
  }
  if (current.key === AuthScreens.Code && newEl.key === AuthScreens.SignUp) {
    return 'zoomSlide'
  } else if (current.key === AuthScreens.SignUp && newEl.key === AuthScreens.Code) {
    return 'zoomSlideReverse'
  }

  return 'zoomFade'
}
const Auth: FC = () => {
  const { auth } = getGlobalState()
  useEffect(() => {
    initializeAuth()
  }, [])

  const renderScreen = useCallback(() => {
    switch (auth.screen) {
      case AuthScreens.PhoneNumber:
        return <AuthPhoneNumber key={AuthScreens.PhoneNumber} />
      case AuthScreens.Code:
        return <AuthCode key={AuthScreens.Code} />
      case AuthScreens.Password:
        return <AuthPassword key={AuthScreens.Password} />
      case AuthScreens.SignUp:
        return <SignUp key={AuthScreens.SignUp} />
    }
  }, [auth.screen])

  return (
    <div class="scrollable" id="auth-scroll">
      <div class="Auth">
        <div class="Auth_inner">
          <MountTransition
            activeKey={auth.screen}
            classNames={classNames}
            /* shouldCleanupByKey=["",""] */
            /* if not found - throw error */
            shouldCleanup={false}
            initial={false}
            getTransitionForNew={getAuthScreenTransition}
          >
            {renderScreen()}
          </MountTransition>
          <div id="auth-recaptcha-wrapper">
            <div id="auth-recaptcha" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default memo(Auth)
