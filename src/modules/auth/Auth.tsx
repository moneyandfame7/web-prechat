import type {FC} from 'preact/compat'
import {useCallback} from 'preact/compat'

import 'state/actions/imporant'
import {getGlobalState} from 'state/signal'
import {AuthScreens} from 'types/screens'
import {SwitchTransition} from 'components/transitions'

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

const Auth: FC = () => {
  const {auth} = getGlobalState()

  const renderScreen = useCallback((activeScreen: AuthScreens) => {
    switch (activeScreen) {
      case AuthScreens.Code:
        return <AuthCode key={AuthScreens.Code} />
      case AuthScreens.Password:
        return <AuthPassword key={AuthScreens.Password} />
      case AuthScreens.PhoneNumber:
        return <AuthPhoneNumber key={AuthScreens.PhoneNumber} />
      case AuthScreens.SignUp:
        return <SignUp key={AuthScreens.SignUp} />
    }
  }, [])

  return (
    <div class="scrollable scrollable-hidden" id="auth-scroll">
      <div class="Auth">
        <div class="Auth_inner">
          <SwitchTransition
            shouldCleanup={false}
            name="zoomFade"
            activeKey={auth.screen}
            classNames={classNames}
            durations={300}
            // getTransitionByCase={getTransitionByCase}
          >
            {renderScreen(auth.screen)}
          </SwitchTransition>
        </div>
      </div>
    </div>
  )
}

export default Auth
