import { FC, useCallback, useEffect, useState } from 'preact/compat'

import { initializeApplication } from 'state/initialize'
import { getGlobalState } from 'state/signal'

import Auth from 'modules/auth'
import Lock from 'modules/lockscreen'
import Main from 'modules/main'

import { ErrorCatcher } from 'components/ErrorCatcher'
import { MountTransition } from 'components/MountTransition'

import { ServiceWorker } from '../serviceWorker'
// import { PageLoader } from 'components/PageLoader'

enum ActiveScreen {
  Auth = 'Auth',
  Lock = 'Lock',
  Main = 'Main'
}

const Application: FC = () => {
  const [activeScreen, setActiveScreen] = useState(ActiveScreen.Auth)
  const state = getGlobalState((state) => state)

  useEffect(() => {
    initializeApplication()
  }, [])

  useEffect(() => {
    switch (state.auth.isAuthorized) {
      case true:
        setActiveScreen(ActiveScreen.Main)
        break
      case false:
        setActiveScreen(ActiveScreen.Auth)
        break
    }
  }, [state.auth.isAuthorized])

  const renderContent = useCallback(() => {
    switch (activeScreen) {
      case ActiveScreen.Auth:
        return <Auth key={ActiveScreen.Auth} />
      case ActiveScreen.Lock:
        return <Lock key={ActiveScreen.Lock} />
      case ActiveScreen.Main:
        return <Main key={ActiveScreen.Main} />
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
