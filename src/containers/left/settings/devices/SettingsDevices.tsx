import {type FC, memo, useCallback, useMemo} from 'preact/compat'

import {SettingsContext} from 'context/settings'

import type {ApiSession} from 'api/types'

import {getActions} from 'state/action'
import {selectAllSessions, selectCurrentSession} from 'state/selectors/diff'
import {getGlobalState} from 'state/signal'

import {ColumnSubtitle} from 'components/ColumnSubtitle'
import {ColumnWrapper} from 'components/ColumnWrapper'
import {ConfirmButton} from 'components/ConfirmButton'
import {Button, Icon} from 'components/ui'

import {ActiveSession} from './ActiveSession'

const SettingsDevices: FC = () => {
  const {terminateAllAuthorizations} = getActions()
  const {resetScreen} = SettingsContext.useScreenContext()
  const global = getGlobalState()
  const currentSession = selectCurrentSession(global)
  /**
   * @Todo зробити так, щоб сесія теж могла бути undefined
   */
  const otherSessions = useMemo(
    () =>
      /* global.activeSessions.ids.filter((id) => !global.activeSessions.byId[id].isCurrent) */ selectAllSessions(
        global
      ).filter((s) => !s.isCurrent),
    [global.activeSessions]
  )
  const hasOtherSessions = Boolean(otherSessions.length)
  const handleTerminateAllAuthorizations = useCallback(async () => {
    await terminateAllAuthorizations()
    resetScreen()
  }, [])

  function renderCurrentSession(session: ApiSession) {
    return (
      <>
        <div class="settings-section">
          <ColumnSubtitle text="THIS DEVICE" />
          <ActiveSession session={session} />
        </div>
        {hasOtherSessions && (
          <ConfirmButton
            action="Terminate all other sessions"
            callback={handleTerminateAllAuthorizations}
            title="Are you sure about fucking suka that?"
          >
            <Button
              color="red"
              variant="transparent"
              uppercase={false}
              // onClick={handleTerminateAllAuthorizations}
            >
              <Icon name="stop" />
              Terminate all other sessions
            </Button>
          </ConfirmButton>
        )}
      </>
    )
  }

  function renderOtherSessions(sessions: ApiSession[]) {
    return (
      <div class="settings-section">
        <ColumnSubtitle text="Active sessions" />
        {sessions.map((s) => (
          <ActiveSession key={s.id} session={s} />
        ))}
      </div>
    )
  }
  return (
    <>
      <ColumnWrapper title="Active sessions" onGoBack={resetScreen}>
        {currentSession && renderCurrentSession(currentSession)}
        {hasOtherSessions && renderOtherSessions(otherSessions)}
      </ColumnWrapper>
    </>
  )
}

export default memo(SettingsDevices)
