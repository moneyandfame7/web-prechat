import {type FC, useLayoutEffect} from 'preact/compat'

import Auth from 'modules/auth'
import Lock from 'modules/lockscreen'
import Main from 'modules/main'

import {changeTheme} from 'state/helpers/settings'
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
  useLayoutEffect(() => {
    const prefersSystemTheme = global.settings.general.theme === 'system'
    if (!prefersSystemTheme) {
      return
    }

    const handleChangeTheme = (e: MediaQueryListEvent) => {
      // not action, because action change from system to dark or light
      changeTheme(e.matches ? 'dark' : 'light')
    }
    const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)')

    prefersDarkMode.addEventListener('change', handleChangeTheme)
    return () => {
      prefersDarkMode.removeEventListener('change', handleChangeTheme)
    }
  }, [global.settings.general.theme])

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
    </ErrorCatcher>
  )
}

export {Application}
