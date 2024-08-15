/* eslint-disable no-console */
import {type FC, memo} from 'preact/compat'
import {useCallback, useEffect} from 'preact/hooks'

import {useRegisterSW} from 'virtual:pwa-register/react'

import {logDebugInfo} from 'lib/logger'

import UpdateAppPopup from 'components/popups/UpdateAppPopup.async'

const ServiceWorker: FC = memo(() => {
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW(_, registration) {
      logDebugInfo('[🇺🇦 APP] - Service Worker at', registration?.scope)
    },
    // immediate: true,
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
        <UpdateAppPopup
          onUpdate={() => {
            updateServiceWorker(false)
          }}
        />
      )}
    </>
  )
})

export {ServiceWorker}
