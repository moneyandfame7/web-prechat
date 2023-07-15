import { FC, memo, useCallback } from 'preact/compat'

import { LeftColumnScreen } from 'types/ui'
import { Button } from 'components/ui'

import { useLeftColumn } from '../context'

const Settings: FC = () => {
  const { setScreen } = useLeftColumn()
  const handleResetScreen = useCallback(() => {
    setScreen(LeftColumnScreen.Main)
  }, [])
  return (
    <>
      Settings
      <Button onClick={handleResetScreen}>Reset</Button>
    </>
  )
}

export default memo(Settings)
