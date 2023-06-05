import { FC, memo } from 'preact/compat'

const Main: FC = () => {
  return (
    <div style={{ width: 300, height: 300 }}>
      <p>DORA DURA DORA DURA</p>
      <p>lorem ipsum dorem</p>
    </div>
  )
}

export default memo(Main)
