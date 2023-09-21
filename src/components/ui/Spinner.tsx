import {type FC, useRef} from 'preact/compat'

import clsx from 'clsx'

import type {Size} from 'types/ui'

import './Spinner.scss'

export type SpinnerColor = 'primary' | 'neutral' | 'yellow' | 'white'
interface SpinnerProps {
  size?: Size
  color?: SpinnerColor
  zoom?: boolean
  absoluted?: boolean
}
export const Spinner: FC<SpinnerProps> = ({
  size = 'medium',
  color = 'primary',
  zoom,
  absoluted,
}) => {
  const buildedClassname = clsx('spinner', `spinner-${size}`, `spinner-${color}`, {
    zoomOnce: zoom,
    absoluted,
  })

  return (
    <div class={buildedClassname}>
      <span class="spinner-inner" />
    </div>
  )
}
