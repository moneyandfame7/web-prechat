import {type FC, memo} from 'preact/compat'

import {Spinner} from './ui'

import './ScreenLoader.scss'

export const ScreenLoader: FC = memo(() => {
  return (
    <div class="ScreenLoader">
      <Spinner size="large" color="primary" />
    </div>
  )
})
