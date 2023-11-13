import {type FC, memo} from 'preact/compat'

import {useLazyComponent} from 'hooks/useLazy'

import type {SendMediaModalProps} from './SendMediaModal'

const SendMediaModalAsync: FC<SendMediaModalProps> = (props) => {
  const SendMediaModal = useLazyComponent('SendMediaModal', !props.isOpen)

  return SendMediaModal ? <SendMediaModal {...props} /> : null
}

export default memo(SendMediaModalAsync)
