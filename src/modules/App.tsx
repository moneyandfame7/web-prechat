import {type FC} from 'preact/compat'

import Auth from 'modules/auth'
import Lock from 'modules/lockscreen'
import Main from 'modules/main'

import {getGlobalState} from 'state/signal'

import {ClientError} from 'lib/error/error'

import {ErrorCatcher} from 'components/ErrorCatcher'
import {ScreenLoader} from 'components/ScreenLoader'
import {SwitchTransition} from 'components/transitions'

import {ServiceWorker} from '../serviceWorker'

import './App.scss'

enum AppScreens {
  Auth = 'Auth',
  Lock = 'Lock',
  Main = 'Main',
  Loading = 'Loading',
  Error = 'Error',
}

const Application: FC = () => {
  const global = getGlobalState()

  let initialScreen: AppScreens
  if (ClientError.getError().value.length) {
    initialScreen = AppScreens.Error
  } else if (global.initialization) {
    initialScreen = AppScreens.Loading
  } else if (global.auth.session) {
    initialScreen = AppScreens.Main
  } else {
    initialScreen = AppScreens.Auth
  }

  const renderScreen = () => {
    switch (initialScreen) {
      case AppScreens.Auth:
        return <Auth key={AppScreens.Auth} />
      case AppScreens.Lock:
        return <Lock key={AppScreens.Lock} />
      case AppScreens.Error:
        return <div key={AppScreens.Error}>{ClientError.getError()}</div>
      case AppScreens.Loading:
        return <ScreenLoader key={AppScreens.Loading} />
      case AppScreens.Main:
        return <Main key={AppScreens.Main} />
    }
  }
  return (
    <ErrorCatcher>
      <>
        <ServiceWorker />
        <SwitchTransition
          // initial
          name="fade"
          shouldCleanup
          durations={500}
          activeKey={initialScreen}
        >
          {renderScreen()}
        </SwitchTransition>
      </>
    </ErrorCatcher>
  )
}

export {Application}
