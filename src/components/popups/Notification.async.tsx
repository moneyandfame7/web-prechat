import {type FC, memo} from 'preact/compat'

import {useLazyComponent} from 'hooks/useLazy'
import type {NotificationProps} from './Notification'

const NotificationAsync: FC<NotificationProps> = (props) => {
  const Component = useLazyComponent('Notification', !props.isOpen)

  return Component ? <Component {...props} /> : null
}

export default memo(NotificationAsync)
