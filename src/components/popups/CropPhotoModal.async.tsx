import {type FC, memo} from 'preact/compat'

import {useLazyComponent} from 'hooks/useLazy'

import type {CropPhotoModalProps} from './CropPhotoModal'

const CropPhotoModalAsync: FC<CropPhotoModalProps> = (props) => {
  const CropPhotoModal = useLazyComponent('CropPhotoModal', !props.isOpen)
  // const Component = useLazyComponent('Notification', !props.isOpen)

  return CropPhotoModal ? <CropPhotoModal {...props} /> : null
  // return NewContactModal ? <NewContactModal {...props} /> : null
}

export default memo(CropPhotoModalAsync)
