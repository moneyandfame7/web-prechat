import type { VNode } from 'preact'
import { type FC } from 'preact/compat'

import { useScreenManager } from 'hooks/useScreenManager'
import { Button } from 'components/ui'

enum Screens {
  First = 'first',
  Second = 'second'
}
const First: FC<{ aboba: number }> = ({ aboba }) => {
  return <>first {aboba}</>
}

const Second: FC = () => {
  return <>second</>
}
const screenCases: Record<Screens, VNode> = {
  [Screens.First]: <First aboba={1} />,
  [Screens.Second]: <Second />
}
export const ScreenManagerTest: FC = () => {
  const { setScreen, renderScreen } = useScreenManager({
    initial: Screens.First,
    forResetScreen: Screens.Second,
    cases: screenCases
  })

  return (
    <>
      {renderScreen()}
      <Button
        onClick={() => {
          setScreen(Screens.First)
        }}
      >
        First
      </Button>
      <Button
        onClick={() => {
          setScreen(Screens.Second)
        }}
      >
        Second
      </Button>
    </>
  )
}
