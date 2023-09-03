import type {FC} from 'preact/compat'

import styles from './ColumnSubtitle.module.scss'

interface ColumnSubtitleProps {
  text: string
}
export const ColumnSubtitle: FC<ColumnSubtitleProps> = ({text}) => {
  return <h2 class={styles.columnSubtitle}>{text}</h2>
}
