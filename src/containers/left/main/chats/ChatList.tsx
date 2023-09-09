import {type FC} from 'preact/compat'

import {selectChat, selectChatsIds, selectIsChatsFetching} from 'state/selectors/chats'
import {getGlobalState} from 'state/signal'

import {Transition} from 'components/transitions'

import {ChatItem} from './ChatItem'

import './ChatList.scss'

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
  const global = getGlobalState()
  const chatIds = selectChatsIds(global)

  return (
    <>
      {chatIds.map((id) => (
        <ChatItem chatId={id} key={id} />
      ))}
    </>
  )
}
enum TestKey {
  Skeleton,
  List,
}
export const Chats: FC = () => {
  const global = getGlobalState()
  const isChatsFetching = selectIsChatsFetching(global)

  let activeScreen: TestKey = TestKey.Skeleton
  activeScreen = isChatsFetching ? TestKey.Skeleton : TestKey.List
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
      <Transition
        containerClassname="chats-list scrollable scrollable-y"
        name="fade"
        shouldCleanup
        activeKey={activeScreen}
        // durations={250}
      >
        {render()}
      </Transition>
    </>
  )
}
