import { FC } from 'preact/compat'

import { useComputed, useSignal } from '@preact/signals'

import { MountTransition } from 'components/MountTransition'
import Auth from 'modules/auth'
import Lock from 'modules/lockscreen'
import Main from 'modules/main'

import './app.scss'
import { ServiceWorker } from './serviceWorker'

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

  return (
    <>
      <ServiceWorker />
      <div style={{ marginLeft: 300, position: 'relative' }}>
        <MountTransition
          activeKey={activeScreen.value}
          shouldCleanup
          name="fade"
        >
          {renderContent.value}
        </MountTransition>
      </div>
    </>
  )
}

export { Application }
