import { type FC } from 'preact/compat'
import type { VNode } from 'preact'

import { getGlobalState } from 'state/signal'
import { useScreenManager } from 'hooks'

import { Spinner } from 'components/ui'
import { ErrorCatcher } from 'components/ErrorCatcher'
import { MountTransition } from 'components/MountTransition'

import Auth from 'modules/auth'
import Lock from 'modules/lockscreen'
import Main from 'modules/main'

import { hasSession } from 'state/helpers/auth'
import { ServiceWorker } from '../serviceWorker'

import './App.scss'

enum AppScreens {
  Auth = 'Auth',
  Lock = 'Lock',
  Main = 'Main',
  Loading = 'Loading'
}

const screenCases: Record<AppScreens, VNode> = {
  [AppScreens.Auth]: <Auth />,
  [AppScreens.Lock]: <Lock />,
  [AppScreens.Main]: <Main />,
  [AppScreens.Loading]: (
    <div class="PageLoader">
      <Spinner size="large" color="primary" />
    </div>
  )
}
const Application: FC = () => {
  const state = getGlobalState()
  let initialScreen: AppScreens

  if (state.initialization) {
    initialScreen = AppScreens.Loading
  } else if (hasSession()) {
    initialScreen = AppScreens.Main
  } else {
    initialScreen = AppScreens.Auth
  }

  const { renderScreen, activeScreen } = useScreenManager<AppScreens>({
    initial: initialScreen,
    cases: screenCases,
    existScreen: initialScreen
  })
  return (
    <ErrorCatcher>
      <>
        <ServiceWorker />
        <MountTransition activeKey={activeScreen} shouldCleanup name="fade" duration={300} initial>
          {renderScreen()}
        </MountTransition>
      </>
    </ErrorCatcher>
  )
}

export { Application }
