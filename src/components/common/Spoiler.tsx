import type {FC} from 'preact/compat'

import './Spoiler.scss'

interface OwnProps {
  shown: boolean
}
export const Spoiler: FC<OwnProps> = ({shown}) => {
  const buildedClass = `spoiler${shown ? ' shown' : ''}`

  return <div class={buildedClass} />
}
