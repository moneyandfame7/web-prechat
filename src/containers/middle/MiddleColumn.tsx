import {type FC} from 'preact/compat'

import {useScreenManager} from 'hooks'

import {Button} from 'components/ui'
import MountTransition from 'components/MountTransition'

import './MiddleColumn.scss'

enum Test {
  First = 'first',
  Second = 'second'
}

export const MiddleColumn: FC = () => {
  const {activeScreen, renderScreen, setScreen} = useScreenManager<Test>({
    cases: {
      [Test.First]: (
        <div style={{width: '300px', height: 300, backgroundColor: 'red'}}></div>
      ),
      [Test.Second]: (
        <div style={{width: '300px', height: 300, backgroundColor: 'blue'}}></div>
      )
    },
    initial: Test.First
  })
  return (
    <div class="MiddleColumn">
      Middle column
      <Button
        onClick={() => {
          setScreen(Test.First)
        }}
      >
        First
      </Button>
      <Button
        onClick={() => {
          setScreen(Test.Second)
        }}
      >
        Second
      </Button>
      <MountTransition
        activeKey={activeScreen}
        name="zoomSlideReverse"
        shouldCleanup={false}
        absoluted={true}
      >
        {renderScreen()}
      </MountTransition>
    </div>
  )
}
