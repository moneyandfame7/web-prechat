import {type FC, memo} from 'preact/compat'

import {useLazyComponent} from 'hooks/useLazy'

import type {NewContactModalProps} from './NewContactModal'

const NewContactModalAsync: FC<NewContactModalProps> = props => {
  const NewContactModal = useLazyComponent('NewContactModal', !props.isOpen)
  // const Component = useLazyComponent('Notification', !props.isOpen)

  return NewContactModal ? <NewContactModal {...props} /> : null
  // return NewContactModal ? <NewContactModal {...props} /> : null
}

export default memo(NewContactModalAsync)
