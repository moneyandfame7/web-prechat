import type {ComponentChildren} from 'preact'
import type {FC} from 'preact/compat'

import clsx from 'clsx'

import {ColumnSubtitle} from 'components/ColumnSubtitle'

import './ColumnSection.scss'

interface ColumnSectionProps {
  title?: string
  children: ComponentChildren
  className?: string
  withoutMargin?: boolean
  withBorder?: boolean
}
const ColumnSection: FC<ColumnSectionProps> = ({
  title,
  children,
  className,
  withoutMargin,
  withBorder = false,
}) => {
  const buildedClass = clsx('column-section', className, {
    'mb-0': withoutMargin,
    'with-border': withBorder,
  })
  return (
    <div class={buildedClass}>
      {title && <ColumnSubtitle primary>{title}</ColumnSubtitle>}
      {children}
    </div>
  )
}

export {ColumnSection}
