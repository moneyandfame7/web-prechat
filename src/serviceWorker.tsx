/* eslint-disable no-console */
import {type FC, memo} from 'preact/compat'
import {useCallback, useEffect} from 'preact/hooks'

import {useRegisterSW} from 'virtual:pwa-register/react'

import {logDebugInfo} from 'lib/logger'

const ServiceWorker: FC = memo(() => {
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW(_, registration) {
      logDebugInfo('[🇺🇦 APP] - Service Worker at', registration?.scope)
    },
    immediate: true,
  })
  const close = useCallback(() => {
    setOfflineReady(false)
    setNeedRefresh(false)
  }, [setOfflineReady, setNeedRefresh])

  useEffect(() => {
    if (offlineReady) {
      logDebugInfo('[🇺🇦 APP] - Your app has been installed, it now works offline!')
    } else if (needRefresh) {
      logDebugInfo('[🇺🇦 APP] - A new update is available!')
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
            height: '100%',
            zIndex: 1,
          }}
        >
          <button onClick={() => updateServiceWorker(false)}>Update Prechat</button>
        </div>
      )}
    </>
  )
})

export {ServiceWorker}
