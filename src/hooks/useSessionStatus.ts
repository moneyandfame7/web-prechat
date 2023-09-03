import {useEffect, useState} from 'preact/hooks'

import type {ApiSession} from 'api/types'

import {getSessionStatus} from 'state/helpers/account'

import {milliseconds} from 'utilities/date/ms'

import {useInterval} from './useInterval'

export const useSessionStatus = (session: ApiSession, isFull = false) => {
  console.log({session})
  const [status, setStatus] = useState<string | undefined>(undefined)
  useInterval(
    () => {
      setStatus(getSessionStatus(session, isFull))
    },
    session.isCurrent ? null : milliseconds({minutes: 1}),
    true
  )

  useEffect(() => {
    setStatus(getSessionStatus(session, isFull))
  }, [session])

  return status
}
