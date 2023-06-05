import { FC } from 'preact/compat'
import { useCallback, useEffect } from 'preact/hooks'

import { useRegisterSW } from 'virtual:pwa-register/react'

export const ServiceWorker: FC = () => {
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker
  } = useRegisterSW()
  console.log('SW RERENDER')
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
            height: '100%'
          }}
        >
          <h1>Need to refresh!</h1>
          <button onClick={() => updateServiceWorker(true)}>Reload</button>
          <button onClick={close}>Close</button>
        </div>
      )}
    </>
  )
}
