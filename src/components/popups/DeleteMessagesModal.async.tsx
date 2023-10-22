import {type FC, memo} from 'preact/compat'

import {useLazyComponent} from 'hooks/useLazy'

import type {OwnProps} from './DeleteMessagesModal'

const DeleteMessagesModalAsync: FC<OwnProps> = (props) => {
  const DeleteMessagesModal = useLazyComponent('DeleteMessagesModal', !props.isOpen)
  // const Component = useLazyComponent('Notification', !props.isOpen)

  return DeleteMessagesModal ? <DeleteMessagesModal {...props} /> : null
  // return NewContactModal ? <NewContactModal {...props} /> : null
}

export default memo(DeleteMessagesModalAsync)
