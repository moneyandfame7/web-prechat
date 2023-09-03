import {type FC, memo, useCallback} from 'preact/compat'

import {SettingsContext} from 'context/settings'

import {getActions} from 'state/action'
import {selectAllSessions, selectCurrentSession, selectSession} from 'state/selectors/diff'
import {getGlobalState} from 'state/signal'

import {ColumnSubtitle} from 'components/ColumnSubtitle'
import {ColumnWrapper} from 'components/ColumnWrapper'
import {Button, Icon} from 'components/ui'

import {ActiveSession} from './ActiveSession'

const SettingsDevices: FC = () => {
  const {terminateAllAuthorizations} = getActions()
  const {resetScreen} = SettingsContext.useScreenContext()
  const global = getGlobalState()
  const currentSession = selectCurrentSession(global)
  const allExceptCurrent = selectAllSessions(global).filter((s) => s.id !== currentSession?.id)

  const handleTerminateAllAuthorizations = useCallback(async () => {
    await terminateAllAuthorizations()
    resetScreen()
  }, [])
  return (
    <>
      <ColumnWrapper title="Active sessions" onGoBack={resetScreen}>
        <div class="settings-section">
          <ColumnSubtitle text="THIS DEVICE" />
          {currentSession && <ActiveSession sessionId={currentSession.id} />}

          <Button
            color="red"
            variant="transparent"
            uppercase={false}
            onClick={handleTerminateAllAuthorizations}
          >
            <Icon name="stop" />
            {/*
             * confirm MODAL HERE ( create component or hook or idk)
             * DELETE AND UPDATE STATE
             */}
            Terminate all other sessions
          </Button>
        </div>
        <div class="settings-section">
          <ColumnSubtitle text="Active sessions" />
          {allExceptCurrent.map((s) => (
            <ActiveSession key={s.id} sessionId={s.id} />
          ))}
        </div>
      </ColumnWrapper>
    </>
  )
}

export default memo(SettingsDevices)
