import { memo, type FC, useCallback } from 'preact/compat'

import { LeftColumnScreen } from 'types/ui'
import { Button } from 'components/ui'

import { useLeftColumn } from '../context'

const Contacts: FC = () => {
  const { setScreen } = useLeftColumn()
  const handleResetScreen = useCallback(() => {
    setScreen(LeftColumnScreen.Main)
  }, [])
  return (
    <>
      Contacts
      <Button onClick={handleResetScreen}>Reset</Button>
    </>
  )
}

export default memo(Contacts)
