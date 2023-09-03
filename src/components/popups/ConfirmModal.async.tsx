import {type FC, memo} from 'preact/compat'

import {useLazyComponent} from 'hooks/useLazy'

import type {ConfirmModalProps} from './ConfirmModal'

const ConfirmModalAsync: FC<ConfirmModalProps> = (props) => {
  const ConfirmModal = useLazyComponent('ConfirmModal', !props.isOpen)
  // const Component = useLazyComponent('Notification', !props.isOpen)

  return ConfirmModal ? <ConfirmModal {...props} /> : null
  // return NewContactModal ? <NewContactModal {...props} /> : null
}

export default memo(ConfirmModalAsync)
