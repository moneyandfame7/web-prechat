import {type FC, memo} from 'preact/compat'

import {useLazyComponent} from 'hooks/useLazy'

import type {ActiveSessionModalProps} from './ActiveSessionModal'

const ActiveSessionModalAsync: FC<ActiveSessionModalProps> = (props) => {
  const ActiveSessionModal = useLazyComponent('ActiveSessionModal', !props.isOpen)
  // const Component = useLazyComponent('Notification', !props.isOpen)

  return ActiveSessionModal ? <ActiveSessionModal {...props} /> : null
  // return NewContactModal ? <NewContactModal {...props} /> : null
}

export default memo(ActiveSessionModalAsync)
