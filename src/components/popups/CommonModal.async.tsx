import {type FC, memo} from 'preact/compat'

import {useLazyComponent} from 'hooks/useLazy'

import type {CommonModalProps} from './CommonModal'

const CommonModalAsync: FC<CommonModalProps> = (props) => {
  const CommonModal = useLazyComponent('CommonModal', !props.isOpen)

  return CommonModal ? <CommonModal {...props} /> : null
}

export default memo(CommonModalAsync)
