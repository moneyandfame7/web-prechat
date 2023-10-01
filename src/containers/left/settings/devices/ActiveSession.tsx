import {type FC, memo, useCallback} from 'preact/compat'

import type {ApiSession} from 'api/types'

import {getActions} from 'state/action'
import {getSessionIcon, getSessionLocation} from 'state/helpers/account'

import {useBoolean} from 'hooks/useFlag'
import {useSessionStatus} from 'hooks/useSessionStatus'

import ActiveSessionModal from 'components/popups/ActiveSessionModal.async'
import ConfirmModal from 'components/popups/ConfirmModal.async'
import {ListItem, type MenuContextActions} from 'components/ui/ListItem'

import styles from './ActiveSession.module.scss'

interface ActiveSessionProps {
  session: ApiSession
}

export const ActiveSession: FC<ActiveSessionProps> = memo(({session}) => {
  const {setTrue: openModal, setFalse: closeModal, value: isModalOpen} = useBoolean()
  const {
    setTrue: openConfirmation,
    setFalse: closeConfirmation,
    value: isConfirmationOpen,
  } = useBoolean()
  const {terminateAuthorization} = getActions()

  const status = useSessionStatus(session)

  const handleTerminateAuthorization = useCallback(async () => {
    terminateAuthorization({
      sessionId: session.id,
    })
  }, [session])

  const contextActions: MenuContextActions[] | undefined = session.isCurrent
    ? undefined
    : [{handler: openConfirmation, danger: true, icon: 'stop', title: 'Terminate'}]
  return (
    <>
      <ListItem
        contextActions={contextActions}
        className={styles.activeSession}
        title={session.platform}
        additional={status}
        subtitle={getSessionLocation(session)}
        onClick={openModal}
      >
        <img
          class={styles.icon}
          src={`devices/${getSessionIcon(session)}.svg`}
          alt="Device icon"
        />
      </ListItem>
      <ConfirmModal
        isOpen={isConfirmationOpen}
        onClose={closeConfirmation}
        action="Terminate session"
        content="Are you sure you want to terminate this session?"
        callback={handleTerminateAuthorization}
      />
      <ActiveSessionModal session={session} isOpen={isModalOpen} onClose={closeModal} />
    </>
  )
})
