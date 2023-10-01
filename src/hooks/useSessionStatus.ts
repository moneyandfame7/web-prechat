import {useEffect, useState} from 'preact/hooks'

import type {ApiSession} from 'api/types'

import {getSessionStatus} from 'state/helpers/account'

import {milliseconds} from 'utilities/date/ms'

import {useInterval} from './useInterval'

export const useSessionStatus = (session: ApiSession | undefined, isFull = false) => {
  const [status, setStatus] = useState<string | undefined>(undefined)
  useInterval(
    () => {
      setStatus(session ? getSessionStatus(session, isFull) : undefined)
    },
    session?.isCurrent ? null : milliseconds({minutes: 1}),
    true
  )

  useEffect(() => {
    setStatus(session ? getSessionStatus(session, isFull) : undefined)
  }, [session])

  return status
}
