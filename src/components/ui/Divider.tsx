import type {FC} from 'preact/compat'

import './Divider.scss'
import clsx from 'clsx'
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
