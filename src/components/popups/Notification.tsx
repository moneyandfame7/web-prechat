import {useCallback, type FC, memo, useEffect} from 'preact/compat'

import {getActions} from 'state/action'
import {getGlobalState} from 'state/signal'

import {NOTIFICATION_TRANSITION} from 'common/config'

import {TransitionTest} from 'components/transitions'
import {Portal} from 'components/ui/Portal'

import './Notification.scss'
import {Icon} from 'components/ui'

export interface NotificationProps {
  isOpen: boolean
}

const Notification: FC<NotificationProps> = ({isOpen}) => {
  const actions = getActions()
  const {notification} = getGlobalState()
  const handleBackdropClick = useCallback(() => {
    actions.closeNotification()
  }, [])
  useEffect(() => {
    if (isOpen) {
      document.documentElement.classList.add('hasOpenPopup')
    } else {
      document.documentElement.classList.remove('hasOpenPopup')
    }
  }, [isOpen])

  return (
    <Portal>
      <TransitionTest
        appear
        className="Notification"
        name="fade"
        isMounted={isOpen}
        alwaysMounted={false}
        duration={NOTIFICATION_TRANSITION}
      >
        <div class="Notification-container" onMouseDown={handleBackdropClick}>
          <Icon name="info" />
          {notification.$title}
        </div>
      </TransitionTest>
    </Portal>
  )
}
export default memo(Notification)
