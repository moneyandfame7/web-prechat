import type {FC} from 'preact/compat'

import clsx from 'clsx'

import './Divider.scss'

interface DividerProps {
  textAlign?: 'left' | 'center' | 'right'
}
export const Divider: FC<DividerProps> = ({textAlign = 'center', children}) => {
  const buildedClass = clsx('divider', `divider-${textAlign}`)

  return (
    <div class={buildedClass} role="separator">
      {children && <span class="divider-wrapper">{children}</span>}
    </div>
  )
}
