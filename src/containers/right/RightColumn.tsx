import type { FC} from 'preact/compat';
import { memo } from 'preact/compat'

import './RightColumn.scss'
const RightColumn: FC = () => {
  return <div class="RightColumn">Right column</div>
}

export default memo(RightColumn)
