import {type FC} from 'preact/compat'

import Auth from 'modules/auth'
import Lock from 'modules/lockscreen'
import Main from 'modules/main'

import {getGlobalState} from 'state/signal'

import {ClientError} from 'lib/error/error'

import {ErrorCatcher} from 'components/ErrorCatcher'
import {ScreenLoader} from 'components/ScreenLoader'
import {Transition} from 'components/transitions'

import {ServiceWorker} from '../serviceWorker'

import './App.scss'

enum AppScreens {
  Auth,
  Lock,
  Main,
  Loading,
  Error,
}

const Application: FC = () => {
  const global = getGlobalState()
  // useEffect(()=>{},[])
  let initialScreen: AppScreens
  if (ClientError.getError().value.length) {
    initialScreen = AppScreens.Error
  } else if (global.initialization) {
    initialScreen = AppScreens.Loading
  } else if (global.auth.session /* && hasActiveSession() */) {
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
      <ServiceWorker />
      <Transition timeout={350} name="fade" activeKey={initialScreen} shouldCleanup>
        {renderScreen()}
      </Transition>
      <noscript>
        <div className="noscript-warning">Please enable JavaScript to use this site.</div>
      </noscript>
    </ErrorCatcher>
  )
}

export {Application}
