import { FC, useCallback } from 'preact/compat'

import { getGlobalState } from 'state/signal'

import { ErrorCatcher } from 'components/ErrorCatcher'
import { MountTransition } from 'components/MountTransition'
import { Spinner } from 'components/Spinner'

import Auth from 'modules/auth'
import Lock from 'modules/lockscreen'
import Main from 'modules/main'

import { ServiceWorker } from '../serviceWorker'

import './App.scss'

enum ActiveScreen {
  Auth = 'Auth',
  Lock = 'Lock',
  Main = 'Main',
  Loading = 'Loading'
}

const Application: FC = () => {
  const state = getGlobalState()
  let activeScreen: ActiveScreen
  if (state.initialization) {
    activeScreen = ActiveScreen.Loading
  } else if (Boolean(state.auth.session)) {
    activeScreen = ActiveScreen.Main
  } else {
    activeScreen = ActiveScreen.Auth
  }

  const renderContent = useCallback(() => {
    switch (activeScreen) {
      case ActiveScreen.Auth:
        return <Auth key={ActiveScreen.Auth} />
      case ActiveScreen.Lock:
        return <Lock key={ActiveScreen.Lock} />
      case ActiveScreen.Main:
        return <Main key={ActiveScreen.Main} />
      case ActiveScreen.Loading:
        return (
          <div key={ActiveScreen.Loading} class="PageLoader">
            <Spinner size="large" color="primary" />
          </div>
        )
    }
  }, [activeScreen])

  return (
    // <PageLoader on={state.initialization}>
    <ErrorCatcher>
      <>
        <ServiceWorker />
        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
          <MountTransition activeKey={activeScreen} shouldCleanup name="fade" initial={false}>
            {renderContent()}
          </MountTransition>
        </div>
      </>
    </ErrorCatcher>
    // </PageLoader>
  )
}

export { Application }
