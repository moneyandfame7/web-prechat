import type {FC} from 'preact/compat'

import {Icon} from './ui'

import './UploadPhoto.scss'

export const UploadPhoto: FC = () => {
  return (
    <div class="UploadPhoto">
      <Icon name="cameraAdd" width={40} height={40} />
    </div>
  )
}
