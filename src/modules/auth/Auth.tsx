import {type FC, useCallback, useEffect} from 'preact/compat'

import 'state/actions/imporant'
import {getGlobalState} from 'state/signal'
import {startPersist} from 'state/storages'
import {cleanupUnusedAuthState} from 'state/updates'

import {preloadImage} from 'utilities/preloadImage'

import {AuthScreens} from 'types/screens'

import {SwitchTransition} from 'components/transitions'
import {Button} from 'components/ui'

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

// прелоад манкі??
// не знаю як пофіксити кейс, коли з асинхронними компонентами flickering mount компонента, тому використовую fade, там це непомітно
// const getTransitionByCase = (
//   _: AuthScreens,
//   previousScreen?: AuthScreens
// ): TransitionCases => {
//   if (previousScreen === AuthScreens.PhoneNumber) {
//     return SLIDE_IN
//   }

//   return SLIDE_OUT
// }

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
    // preloadImage(monkeySvg)
    return () => {
      // console.log('AUTH REMOVED')
      cleanupUnusedAuthState(global)
    }
  }, [])
  return (
    <div class="scrollable scrollable-hidden" id="auth-scroll">
      <div class="Auth">
        <Button
          onClick={() => {
            global.auth.session = '12348123848128348128348143'
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
        </Button>
        <div class="Auth_inner">
          <SwitchTransition
            shouldCleanup={false}
            name="zoomFade"
            activeKey={global.auth.screen}
            // permanentClassname="Screen-container"
            classNames={classNames}
            durations={300}
            // getTransitionByCase={getTransitionByCase}
          >
            {renderScreen()}
          </SwitchTransition>
        </div>
      </div>
    </div>
  )
}

export default Auth
