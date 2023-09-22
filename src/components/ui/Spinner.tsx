import {type FC} from 'preact/compat'

import clsx from 'clsx'

import type {Size} from 'types/ui'

import './Spinner.scss'

export type SpinnerColor = 'primary' | 'neutral' | 'yellow' | 'white'
interface SpinnerProps {
  size?: Size
  color?: SpinnerColor
}
export const Spinner: FC<SpinnerProps> = ({size = 'medium', color = 'primary'}) => {
  const buildedClassname = clsx('spinner', `spinner-${size}`, `spinner-${color}`, {})

  return (
    <div class={buildedClassname}>
      <span class="spinner-inner" />
    </div>
  )
}
