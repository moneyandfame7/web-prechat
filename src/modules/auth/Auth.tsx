import {type FC, useCallback} from 'preact/compat'

import 'state/actions/imporant'
import {AuthScreens} from 'types/screens'

import {SwitchTransition} from 'components/transitions'
import {Button} from 'components/ui'

import SignUp from './SignUp.async'
import AuthCode from './AuthCode.async'
import AuthPassword from './AuthPassword.async'
import AuthPhoneNumber from './AuthPhoneNumber'
import {getGlobalState} from 'state/signal'
// import {appManager} from 'managers/manager'

const classNames = {
  [AuthScreens.Code]: 'Auth_code',
  [AuthScreens.Password]: 'Auth_password',
  [AuthScreens.PhoneNumber]: 'Auth_phone',
  [AuthScreens.SignUp]: 'Auth_signup'
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
  const {auth} = getGlobalState()
  // authState.
  const renderScreen = useCallback(() => {
    switch (auth.screen) {
      case AuthScreens.Code:
        return <AuthCode />
      case AuthScreens.Password:
        return <AuthPassword />
      case AuthScreens.PhoneNumber:
        return <AuthPhoneNumber />
      case AuthScreens.SignUp:
        return <SignUp />
    }
  }, [auth.screen])

  return (
    <div class="scrollable scrollable-hidden" id="auth-scroll">
      <div class="Auth">
        <Button
          onClick={() => {
            // appManager.appAuthManager.mockAuth()
            // authStore.actions.mockAuth()
            auth.session = '12348123848128348128348143'
          }}
        >
          Mock auth
        </Button>
        <div class="Auth_inner">
          <SwitchTransition
            shouldCleanup={false}
            name="zoomFade"
            activeKey={auth.screen}
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
