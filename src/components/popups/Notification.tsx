import {type FC, memo, useCallback, useEffect} from 'preact/compat'

import {getActions} from 'state/action'
import {getGlobalState} from 'state/signal'

import {NOTIFICATION_TRANSITION} from 'common/environment'

import {SingleTransition} from 'components/transitions'
import {Icon} from 'components/ui'
import {Portal} from 'components/ui/Portal'

import './Notification.scss'

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
      <SingleTransition
        appear
        className="notification"
        name="fade"
        in={isOpen}
        unmount
        timeout={NOTIFICATION_TRANSITION}
      >
        <div class="notification-container" onMouseDown={handleBackdropClick}>
          <Icon name="info" />
          {notification.$title}
        </div>
      </SingleTransition>
    </Portal>
  )
}
export default memo(Notification)
