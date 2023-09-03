import {useSignal} from '@preact/signals'
import {type FC, memo, useEffect, useMemo} from 'preact/compat'

import {getSessionIcon, getSessionLocation, getSessionStatus} from 'state/helpers/account'
import {selectSession} from 'state/selectors/diff'
import {getGlobalState} from 'state/signal'

import {milliseconds} from 'utilities/date/ms'

import ActiveSessionModal from 'components/popups/ActiveSessionModal.async'
import {ListItem} from 'components/ui/ListItem'
import {useBoolean} from 'hooks/useFlag'
import {useInterval} from 'hooks/useInterval'
import {useSessionStatus} from 'hooks/useSessionStatus'

import styles from './ActiveSession.module.scss'

interface ActiveSessionProps {
  sessionId: string
}

export const ActiveSession: FC<ActiveSessionProps> = memo(({sessionId}) => {
  const global = getGlobalState()
  const activeSession = selectSession(global, sessionId)

  const {setTrue: openModal, setFalse: closeModal, value: isModalOpen} = useBoolean()

  const status = useSessionStatus(activeSession)

  return (
    <>
      <ListItem
        className={styles.activeSession}
        title={activeSession.platform}
        additional={status}
        subtitle={getSessionLocation(activeSession)}
        onClick={openModal}
      >
        <img
          class={styles.icon}
          src={`devices/${getSessionIcon(activeSession)}.svg`}
          alt="Device icon"
        />
      </ListItem>
      <ActiveSessionModal session={activeSession} isOpen={isModalOpen} onClose={closeModal} />
    </>
  )
})
