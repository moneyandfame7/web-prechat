import {type FC, memo, useLayoutEffect} from 'preact/compat'

import Auth from 'modules/auth'
import Lock from 'modules/lockscreen'
import Main from 'modules/main'

import {type MapState, connect} from 'state/connect'
import {changeTheme} from 'state/helpers/settings'
import {selectGeneralSettings} from 'state/selectors/settings'

import {ClientError} from 'lib/error/error'

import type {EmptyObject} from 'types/common'
import type {Theme} from 'types/state'

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

interface StateProps {
  theme: Theme // спробувати з SIGNAL THEME
  isLogout: boolean
  session: string | undefined
  initialization: boolean
}
const ApplicationImpl: FC<StateProps> = ({theme, initialization, session, isLogout}) => {
  useLayoutEffect(() => {
    const prefersSystemTheme = theme === 'system'
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
  }, [theme])

  let initialScreen: AppScreens
  if (ClientError.getError().value.length) {
    initialScreen = AppScreens.Error
  } else if (initialization) {
    initialScreen = AppScreens.Loading
  } else if (session && !isLogout /* && hasActiveSession() */) {
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
const mapStateToProps: MapState<EmptyObject, StateProps> = (state) => {
  return {
    theme: selectGeneralSettings(state, 'theme'),
    isLogout: state.auth.isLogout,
    session: state.auth.session,
    initialization: state.initialization,
  }
}

export const Application = memo(connect(mapStateToProps)(ApplicationImpl))
