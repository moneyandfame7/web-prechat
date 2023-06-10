import { FC, useEffect } from 'preact/compat'

import { useComputed, useSignal } from '@preact/signals'

import { ErrorCatcher } from 'components/ErrorCatcher'
import { MountTransition } from 'components/MountTransition'
import Auth from 'modules/auth'
import Lock from 'modules/lockscreen'
import Main from 'modules/main'
import { initializeGlobalState } from 'state/global/initialize'

import { ServiceWorker } from '../serviceWorker'

enum ActiveScreen {
  Auth = 'Auth',
  Lock = 'Lock',
  Main = 'Main'
}

const Application: FC = () => {
  const activeScreen = useSignal(ActiveScreen.Auth)
  // const location = useLocation()
  const renderContent = useComputed(() => {
    switch (activeScreen.value) {
      case ActiveScreen.Auth:
        return <Auth key={ActiveScreen.Auth} />
      case ActiveScreen.Lock:
        return <Lock key={ActiveScreen.Lock} />
      case ActiveScreen.Main:
        return <Main key={ActiveScreen.Main} />
    }
  })
  useEffect(() => {
    initializeGlobalState()
  }, [])
  return (
    <ErrorCatcher>
      <ServiceWorker />
      <div style={{ position: 'relative', width: '100%', height: '100%' }}>
        <MountTransition activeKey={activeScreen.value} shouldCleanup name="fade" initial={false}>
          {renderContent.value}
        </MountTransition>
      </div>
    </ErrorCatcher>
  )
}

export { Application }
