import {type FC} from 'preact/compat'

import {ReactComponent as EmptyChatImg} from 'assets/EmptyChats.svg'

import {selectChatsIds, selectIsChatsFetching} from 'state/selectors/chats'
import {getGlobalState} from 'state/signal'

import {TEST_translate} from 'lib/i18n'

import {ColumnSection} from 'containers/left/ColumnSection'

import {UserItem} from 'components/UserItem'
import {Transition} from 'components/transitions'

import {ChatItem} from './ChatItem'

import './ChatList.scss'

const Skeleton = () => {
  return (
    <div class="skeleton-list">
      {Array.from({length: 15}).map((id) => (
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
    </div>
  )
}

const EmptyChats = () => {
  const global = getGlobalState()

  const contacts = global.users.contactIds
  return (
    <>
      <ColumnSection className="empty-chats">
        {/* @ts-expect-error Preact types are confused */}
        <EmptyChatImg />
        <h1 class="empty-chats__title">{TEST_translate('ChatList.EmptyChatsTitle')}</h1>
        <p class="empty-chats__info">
          {TEST_translate('ChatList.EmptyChatsSubtitle', {count: contacts.length})}
        </p>
      </ColumnSection>
      <ColumnSection className="contacts-list" title="Contacts">
        {/* <ChatListTest> */}
        {contacts.map((c) => {
          return <UserItem key={c} userId={c} />
        })}
        {/* </ChatListTest> */}
      </ColumnSection>
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

export const ChatList: FC = () => {
  const global = getGlobalState()
  const isChatsFetching = selectIsChatsFetching(global)

  let activeScreen: TestKey = TestKey.Skeleton
  activeScreen = isChatsFetching ? TestKey.Skeleton : TestKey.List
  const render = () => {
    switch (activeScreen) {
      case TestKey.List:
        return <EmptyChats />
      default:
        return <Skeleton />
    }
  }

  // const buildedClass = clsx('chats-list', {
  //   'scrollable scrollable-y': !isChatsFetching,
  // })
  // useSignalEffect(() => {
  //   if (!MOCK_CHAT_FETCH.value) {
  //     setTimeout(() => {
  //       containerRef.current!.style.overflowY = 'auto'
  //     }, 200)
  //   } else {
  //     setTimeout(() => {
  //       containerRef.current!.style.overflowY = 'hidden'
  //     }, 200)
  //   }
  // })
  return (
    <Transition
      containerClassname={`chats-list scrollable scrollable-y${
        isChatsFetching ? ' fetching' : ''
      }`}
      name="fade"
      shouldCleanup={false}
      activeKey={activeScreen}
      // durations={250}
    >
      {render()}
    </Transition>
  )
}
