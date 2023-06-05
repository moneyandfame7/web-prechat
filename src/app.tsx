import { FC, useEffect } from 'preact/compat'

import { signal, useComputed, useSignal } from '@preact/signals'

import { ErrorCatcher } from '@components/Error'
import { MountTransition } from '@components/MountTransition'
import Auth from '@modules/auth'
import Lock from '@modules/lockscreen'
import Main from '@modules/main'

import './app.scss'
import { ServiceWorker } from './serviceWorker'

enum ActiveScreen {
  Auth = 'Auth',
  Lock = 'Lock',
  Main = 'Main'
}

const counter = signal(16)

// counter.subscribe((v) => {
//   // eslint-disable-next-line no-console
//   console.log({ v })
// })
export const App: FC = () => {
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
    if (window.location.hash.length < 5) {
      const newPath = window.location.pathname + window.location.search
      window.history.replaceState(null, '', newPath)
    }
    const handleLocationChange = () => {
      const { hash } = window.location

      if (hash.length > 5) {
        console.log('OKEYYYY)))')
      } else {
        const newPath = window.location.pathname + window.location.search
        window.history.replaceState(null, '', newPath)
      }
    }
    window.addEventListener('popstate', handleLocationChange)

    return () => {
      window.removeEventListener('popstate', handleLocationChange)
    }
  }, [])
  return (
    <ErrorCatcher>
      <>
        <button
          onMouseDown={(e) => {
            e.preventDefault()
            activeScreen.value = ActiveScreen.Lock
          }}
        >
          Just click on mee
        </button>
        <button
          onMouseDown={(e) => {
            e.preventDefault()
            activeScreen.value = ActiveScreen.Main
          }}
        >
          Just click on me
        </button>
        <button
          onMouseDown={(e) => {
            e.preventDefault()
            activeScreen.value = ActiveScreen.Auth
          }}
        >
          Just click on me
        </button>
        <button
          onMouseDown={(e) => {
            e.preventDefault()
            e.stopPropagation()
            counter.value += 1
          }}
        >
          COUNTER CHANGE?? {counter}
        </button>
        <h1>Hello world! for {activeScreen}</h1>
        <h2>Environment variable: {import.meta.env.VITE_TEST_KEY}</h2>

        <div
          style={{
            position: 'relative',
            border: '1px solid red',
            height: '100%',
            minHeight: 400
          }}
        >
          <MountTransition shouldCleanup={true} activeKey={activeScreen.value}>
            {renderContent.value}
          </MountTransition>
        </div>
        <ServiceWorker />
      </>
    </ErrorCatcher>
  )
}
