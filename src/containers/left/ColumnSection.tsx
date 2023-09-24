import type {FC} from 'preact/compat'

import type {PreactNode} from 'types/ui'

import {ColumnSubtitle} from 'components/ColumnSubtitle'

import './ColumnSection.scss'

interface ColumnSectionProps {
  title?: string
  children: PreactNode
  className?: string
}
const ColumnSection: FC<ColumnSectionProps> = ({title, children, className}) => (
  <div class={`column-section ${className || ''}`}>
    {title && <ColumnSubtitle primary>{title}</ColumnSubtitle>}
    {children}
  </div>
)

export {ColumnSection}
