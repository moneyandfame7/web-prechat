import {type FC} from 'preact/compat'

import {skeleton} from 'containers/middle/MiddleColumn'

import {SwitchTransition} from 'components/transitions'
import {getGlobalState} from 'state/signal'

import './ChatList.scss'
import {Chat} from './Chat'

const Skeleton = () => {
  return (
    <>
      {Array.from({length: 20}).map((id) => (
        <div class="skeleton-chat-item" key={id}>
          <div class="skeleton skeleton-avatar" />

          <div class="skeleton-info">
            <div class="skeleton-info-row">
              <div class="skeleton skeleton-title" />
              <div class="skeleton skeleton-meta" />
            </div>

            <div class="skeleton skeleton-subtitle" />
          </div>
        </div>
      ))}
    </>
  )
}

const List = () => {
  const {chats} = getGlobalState()
  const ids = Object.keys(chats.byId)
  return (
    <>
      {ids.map((id) => (
        <Chat chatId={id} key={id} />
      ))}
    </>
  )
}
enum TestKey {
  Skeleton,
  List
}
export const Chats: FC = () => {
  let activeScreen: TestKey = TestKey.Skeleton
  activeScreen = skeleton.isLoading ? TestKey.Skeleton : TestKey.List
  const render = () => {
    switch (activeScreen) {
      case TestKey.List:
        return <List />
      default:
        return <Skeleton />
    }
  }
  return (
    <>
      <SwitchTransition
        name="fade"
        shouldCleanup
        activeKey={activeScreen}
        durations={250}
      >
        {render()}
      </SwitchTransition>
      {/* <p>
        lorem ipsum dorem lorem ipsum dorem lorem ipsum dorem lorem ipsum dorem lorem
        ipsum dorem lorem ipsum doremlorem ipsum doremlorem ipsum doremlorem ipsum dorem
        lorem ipsum dorem lorem ipsum dorem lorem ipsum dorem lorem ipsum dorem lorem
        ipsum dorem lorem ipsum doremlorem ipsum doremlorem ipsum doremlorem ipsum
        doremlorem ipsum dorem lorem ipsum dorem lorem ipsum dorem lorem ipsum dorem lorem
        ipsum dorem lorem ipsum doremlorem ipsum doremlorem ipsum doremlorem ipsum dorem
      </p>
      <p>
        lorem ipsum dorem lorem ipsum dorem lorem ipsum dorem lorem ipsum dorem lorem
        ipsum dorem lorem ipsum doremlorem ipsum doremlorem ipsum doremlorem ipsum dorem
        lorem ipsum dorem lorem ipsum dorem lorem ipsum dorem lorem ipsum dorem lorem
        ipsum dorem lorem ipsum doremlorem ipsum doremlorem ipsum doremlorem ipsum
        doremlorem ipsum dorem lorem ipsum dorem lorem ipsum dorem lorem ipsum dorem lorem
        ipsum dorem lorem ipsum doremlorem ipsum doremlorem ipsum doremlorem ipsum dorem
      </p> */}
    </>
  )
}
