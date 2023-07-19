import type { FC } from 'preact/compat'

import './Spinner.scss'

interface SpinnerProps {
  size?: 'large' | 'medium' | 'small'
  color?: 'primary' | 'neutral' | 'yellow' | 'white'
}
export const Spinner: FC<SpinnerProps> = ({ size = 'medium', color = 'primary' }) => {
  const buildedClassname = `spinner spinner-${size} spinner-${color}`

  return <span class={buildedClassname} />
}
