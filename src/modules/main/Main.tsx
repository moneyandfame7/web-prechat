import { FC, memo } from 'preact/compat'

import { MiddleColumn } from 'containers/middle'
import 'state/actions/all'

const Main: FC = () => {
  return (
    <div style={{ width: 300, height: 300 }}>
      <p>DORA DURA DORA DURA</p>
      <p>lorem ipsum dorem</p>
      <MiddleColumn />
    </div>
  )
}

export default memo(Main)
