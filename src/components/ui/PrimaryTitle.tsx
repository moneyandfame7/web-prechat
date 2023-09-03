import type {FC} from 'preact/compat'

import clsx from 'clsx'

import styles from './PrimaryTitle.module.scss'

interface PrimaryTitleProps {
  className?: string
}
export const PrimaryTitle: FC<PrimaryTitleProps> = ({className, children}) => {
  const buildedClass = clsx(styles.root, className)

  return <p class={buildedClass}>{children}</p>
}
