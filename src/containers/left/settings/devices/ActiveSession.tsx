import {type FC, memo} from 'preact/compat'

import type {ApiSession} from 'api/types'

import {getSessionIcon, getSessionLocation} from 'state/helpers/account'

import {useBoolean} from 'hooks/useFlag'
import {useSessionStatus} from 'hooks/useSessionStatus'

import ActiveSessionModal from 'components/popups/ActiveSessionModal.async'
import {ListItem} from 'components/ui/ListItem'

import styles from './ActiveSession.module.scss'

interface ActiveSessionProps {
  session: ApiSession
}

export const ActiveSession: FC<ActiveSessionProps> = memo(({session}) => {
  const {setTrue: openModal, setFalse: closeModal, value: isModalOpen} = useBoolean()

  const status = useSessionStatus(session)

  return (
    <>
      <ListItem
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
      <ActiveSessionModal session={session} isOpen={isModalOpen} onClose={closeModal} />
    </>
  )
})
