import {type FC, memo, useCallback, useRef} from 'preact/compat'

import type {ApiSession} from 'api/types'

import {getActions} from 'state/action'
import {getSessionIcon, getSessionLocation, isAnimatedSessionIcon} from 'state/helpers/account'

import {useSessionStatus} from 'hooks/useSessionStatus'

import {LottiePlayer, type LottieRefCurrentProps} from 'lib/lottie'

import {Button} from 'components/ui'
import {PrimaryTitle} from 'components/ui/PrimaryTitle'

import {Modal, ModalTitle} from './modal'
import {ModalContent, ModalHeader} from './modal/Modal'

import styles from './ActiveSessionModal.module.scss'

export interface ActiveSessionModalProps {
  session: ApiSession
  isOpen: boolean
  onClose: VoidFunction
}

const ActiveSessionModal: FC<ActiveSessionModalProps> = ({session, isOpen, onClose}) => {
  const lottieRef = useRef<LottieRefCurrentProps>(null)
  const {terminateAuthorization} = getActions()

  const handleTerminateAuthorization = useCallback(async () => {
    /* Mark is LOADING??? */
    await terminateAuthorization({
      sessionId: session.id,
    })
    onClose()
  }, [])

  const status = useSessionStatus(session, true)
  const renderBottomBtn = useCallback(() => {
    if (session.isCurrent) {
      return (
        <Button className={styles.button} onClick={onClose} variant="transparent">
          Гаразд
        </Button>
      )
    }
    return (
      <Button
        className={styles.button}
        variant="transparent"
        color="red"
        onClick={handleTerminateAuthorization}
      >
        Terminate session
      </Button>
    )
  }, [session])

  const renderHeaderBtn = useCallback(() => {
    if (session.isCurrent) {
      return <PrimaryTitle>Current session</PrimaryTitle>
    }

    return (
      <Button className={styles.headerBtn} color="red" onClick={handleTerminateAuthorization}>
        Terminate session
      </Button>
    )
  }, [])

  const renderAnimatedIcon = useCallback(() => {
    const sessionIcon = getSessionIcon(session)
    if (isAnimatedSessionIcon(sessionIcon)) {
      return (
        <LottiePlayer
          size="small"
          autoplay
          name={`Device-${sessionIcon}`}
          loading={false}
          loop
          withBlur
          isPausable
          lottieRef={lottieRef}
        />
      )
    }
    return <img class={styles.icon} src={`devices/${sessionIcon}.svg`} alt="Device icon" />
  }, [session])
  /**
   * @todo add active time and created at time.
   */
  return (
    <Modal isOpen={isOpen} onClose={onClose} className={styles.root} closeOnEsc>
      <ModalHeader hasCloseButton>
        <ModalTitle>Сеанс</ModalTitle>
        {renderHeaderBtn()}
      </ModalHeader>
      <ModalContent>
        <div class={styles.container}>
          {renderAnimatedIcon()}
          <h2 class={styles.title}>{session.platform}</h2>
          <h3 class={styles.subtitle}>{session.browser}</h3>
          <p class={styles.date}>{status}</p>
          <div class={styles.info}>
            <p class={styles.rowTitle}>IP Address</p>
            <p class={styles.rowSubtitle}>{session.ip}</p>
            <p class={styles.rowTitle}>Location</p>
            <p class={styles.rowSubtitle}>{getSessionLocation(session)}</p>
          </div>
          <p class={styles.additional}>
            This location estimate is based on the IP address and may not always be accurate.
          </p>
        </div>
        {renderBottomBtn()}
      </ModalContent>
    </Modal>
  )
}
export default memo(ActiveSessionModal)
