import { FC, memo } from 'preact/compat'
import { useCallback, useEffect } from 'preact/hooks'

import { increment, testStore } from 'state/test'
import { useRegisterSW } from 'virtual:pwa-register/react'

const ServiceWorker: FC = memo(() => {
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker
  } = useRegisterSW({
    onRegisteredSW(_, registration) {
      console.log('[🇺🇦 APP] - Service Worker at', registration?.scope)
    }
  })
  const close = useCallback(() => {
    setOfflineReady(false)
    setNeedRefresh(false)
  }, [setOfflineReady, setNeedRefresh])

  useEffect(() => {
    if (offlineReady) {
      console.log(
        '[🇺🇦 APP] - Your app has been installed, it now works offline!'
      )
    } else if (needRefresh) {
      console.log('[🇺🇦 APP] - A new update is available!')
      // Create here a toast or a modal with:
      // <button onClick={updateServiceWorker}>Update app</button>
      // <button onClick={close}>Close</button>
    }
    // console.log('AYYYY')
  }, [close, needRefresh, offlineReady, updateServiceWorker])
  return (
    <>
      {needRefresh && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            backgroundColor: 'pink',
            width: '100%',
            height: '100%',
            zIndex: 1
          }}
        >
          <h1>Need to refresh! {testStore.counter}</h1>
          <button onClick={() => updateServiceWorker(true)}>Reload</button>
          <button onClick={close}>Close</button>
          <button onMouseDown={testStore.inc}>
            Increment with action from store
          </button>

          <button onMouseDown={increment}>Increment with other function</button>
        </div>
      )}
    </>
  )
})

export { ServiceWorker }
