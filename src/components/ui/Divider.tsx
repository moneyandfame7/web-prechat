import type {FC} from 'preact/compat'

import clsx from 'clsx'

import './Divider.scss'

interface DividerProps {
  textAlign?: 'left' | 'center' | 'right'
  primary?: boolean
  bold?: boolean
}
export const Divider: FC<DividerProps> = ({
  textAlign = 'center',
  primary = false,
  children,
  bold,
}) => {
  const buildedClass = clsx(
    'divider',
    `divider-${textAlign}`,
    primary && 'primary',
    bold && 'bold'
  )

  return (
    <div class={buildedClass} role="separator">
      {children && <span class="divider-wrapper">{children}</span>}
    </div>
  )
}
