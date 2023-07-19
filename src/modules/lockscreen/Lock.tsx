import type { FC} from 'preact/compat';
import { memo } from 'preact/compat'

const Lock: FC = () => {
  return (
    <div style={{ width: 300, height: 300 }}>
      <p>lorem ipsum dorem</p>
      <p>lorem ipsum dorem</p>
      <p>lorem ipsum dorem</p>
      <p>lorem ipsum dorem</p>
      <p>lorem ipsum dorem</p>
      <p>lorem ipsum dorem</p>
      <p>lorem ipsum dorem</p>
    </div>
  )
}

export default memo(Lock)
