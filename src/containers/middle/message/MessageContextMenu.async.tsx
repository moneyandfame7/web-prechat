import {type FC, memo} from 'preact/compat'

import {useLazyComponent} from 'hooks/useLazy'

import type {OwnProps} from './MessageContextMenu'

const MessageContextMenuAsync: FC<OwnProps> = (props) => {
  const MessageContextMenu = useLazyComponent('MessageContextMenu', !props.isOpen)
  // const Component = useLazyComponent('Notification', !props.isOpen)

  return MessageContextMenu ? <MessageContextMenu {...props} /> : null
  // return NewContactModal ? <NewContactModal {...props} /> : null
}

export default memo(MessageContextMenuAsync)
