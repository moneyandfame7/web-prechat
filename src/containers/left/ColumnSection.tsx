import type {FC} from 'preact/compat'

import type {PreactNode} from 'types/ui'

import {ColumnSubtitle} from 'components/ColumnSubtitle'

import './ColumnSection.scss'

interface ColumnSectionProps {
  title?: string
  children: PreactNode
}
const ColumnSection: FC<ColumnSectionProps> = ({title, children}) => {
  return (
    <div class="column-section">
      {title && <ColumnSubtitle primary>{title}</ColumnSubtitle>}
      {children}
    </div>
  )
}

export {ColumnSection}
