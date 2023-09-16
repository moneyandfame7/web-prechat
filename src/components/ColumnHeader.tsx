import type {FC, PropsWithChildren} from 'preact/compat'

import {useFastClick} from 'hooks/useFastClick'

import './ColumnHeader.scss'

interface ColumnHeaderProps extends PropsWithChildren {
  className?: string
  onClick?: VoidFunction
}
export const ColumnHeader: FC<ColumnHeaderProps> = ({children, className, onClick}) => {
  const buildedClass = [className, 'column-header'].filter(Boolean).join(' ')
  const clickHandlers = useFastClick({fast: true, handler: onClick})
  return (
    <div {...(onClick ? clickHandlers : {})} class={buildedClass}>
      {children}
    </div>
  )
}
