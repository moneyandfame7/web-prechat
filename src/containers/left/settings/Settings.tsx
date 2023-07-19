import type {FC} from 'preact/compat'
import {memo} from 'preact/compat'

import {Button} from 'components/ui'

import {useLeftColumn} from '../context'

const Settings: FC = () => {
  const {resetScreen} = useLeftColumn()

  return (
    <>
      <div class="LeftColumn-Header">Settings</div>
      <Button onClick={resetScreen}>Reset</Button>
    </>
  )
}

export default memo(Settings)
