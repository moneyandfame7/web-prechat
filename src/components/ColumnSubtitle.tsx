import type {FC} from 'preact/compat'

import clsx from 'clsx'

import type {PreactNode} from 'types/ui'

import styles from './ColumnSubtitle.module.scss'

interface ColumnSubtitleProps {
  children: PreactNode
  primary?: boolean
}
export const ColumnSubtitle: FC<ColumnSubtitleProps> = ({children, primary}) => {
  const buildedClass = clsx(styles.root, primary && styles.primary)
  return <h2 class={buildedClass}>{children}</h2>
}
