import {type FC, useCallback, useEffect} from 'preact/compat'

import 'state/actions/imporant'
import {getGlobalState} from 'state/signal'
import {cleanupUnusedAuthState} from 'state/updates'

import {AuthScreens} from 'types/screens'

import {Transition} from 'components/transitions'

import AuthCode from './AuthCode.async'
import AuthPassword from './AuthPassword.async'
import AuthPhoneNumber from './AuthPhoneNumber'
import SignUp from './SignUp.async'

const classNames = {
  [AuthScreens.Code]: 'Auth_code',
  [AuthScreens.Password]: 'Auth_password',
  [AuthScreens.PhoneNumber]: 'Auth_phone',
  [AuthScreens.SignUp]: 'Auth_signup',
}

const Auth: FC = () => {
  const global = getGlobalState()

  const renderScreen = useCallback(() => {
    switch (global.auth.screen) {
      case AuthScreens.Code:
        return <AuthCode />
      case AuthScreens.Password:
        return <AuthPassword />
      case AuthScreens.PhoneNumber:
        return <AuthPhoneNumber />
      case AuthScreens.SignUp:
        return <SignUp />
    }
  }, [global.auth.screen])

  useEffect(() => {
    return () => {
      cleanupUnusedAuthState(global)
    }
  }, [])
  return (
    <div class="scrollable scrollable-y scrollable-hidden" id="auth-scroll">
      <div class="auth-page">
        {/* <Button
          onClick={() => {
            global.auth.session = '12348123848128348128348143'
            saveSession(global.auth.session)
            startPersist()
          }}
        >
          Mock auth
        </Button>
        <Button
          onClick={() => {
            global.auth.screen =
              global.auth.screen === AuthScreens.PhoneNumber
                ? AuthScreens.Code
                : AuthScreens.PhoneNumber
          }}
        >
          TOGGLE_SCREEN
        </Button> */}
        <Transition
          innerClassnames={classNames}
          name="fade"
          activeKey={global.auth.screen}
          shouldCleanup={false}
        >
          {renderScreen()}
        </Transition>
      </div>
    </div>
  )
}

export default Auth
