import {type FC, memo} from 'preact/compat'

import {useLazyComponent} from 'hooks/useLazy'

import type {UpdateAppPopupProps} from './UpdateAppPopup'

const UpdateAppPopupAsync: FC<UpdateAppPopupProps> = (props) => {
  const UpdateAppPopup = useLazyComponent('UpdateAppPopup')

  return UpdateAppPopup ? <UpdateAppPopup {...props} /> : null
}

export default memo(UpdateAppPopupAsync)
