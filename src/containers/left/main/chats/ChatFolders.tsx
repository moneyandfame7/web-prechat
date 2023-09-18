import {type FC, memo, useCallback, useState} from 'preact/compat'

import {selectChatsIds} from 'state/selectors/chats'
import {getGlobalState} from 'state/signal'

import {type TabItem, TabList} from 'components/common/tabs/TabList'
import {Transition} from 'components/transitions'

import {ChatItem} from './ChatItem'

import './ChatFolders.scss'

const TAB_PANELS = ['FIRST', 'SECOND', 'THIRD', 'FOURTH', 'FIFTH']

const TAB_BTNS = [
  {
    title: 'Lol',
    contextActions: [
      {
        handler: () => {
          console.log('blya')
        },
        title: 'Edit folder',
        danger: true,
        icon: 'edit',
      },
    ],
  },
  {
    title: 'KEK',
    contextActions: [
      {
        title: 'ny kek',
        handler: () => {
          console.log('KEK')
        },
        icon: 'stop',
        danger: true,
      },
    ],
  },
  {
    title: 'KEKKKKKKK',
    contextActions: [
      {
        title: 'ny kek',
        handler: () => {
          console.log('KEK')
        },
        icon: 'stop',
        danger: true,
      },
    ],
  },
  {
    title: 'KEKaksdkfkasdkfkaksdf',
    contextActions: [
      {
        title: 'ny kek',
        handler: () => {
          console.log('KEK')
        },
        icon: 'stop',
        danger: true,
      },
    ],
  },
] as TabItem[]

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
const ChatFolders: FC = memo(() => {
  const [chatFolder, setCurrentChatFolder] = useState(0)

  const handleChangeFolder = useCallback((idx: number) => {
    setCurrentChatFolder(idx)
  }, [])
  return (
    <div class="chat-folders">
      {/* <ListItem /> */}
      <TabList
        // contextLimiterSelector="#left-column"
        activeTab={chatFolder}
        onChange={handleChangeFolder}
        tabs={TAB_BTNS}
      />

      <Transition
        innerClassnames="chat-list scrollable scrollable-y"
        name="slide"
        activeKey={chatFolder}
        shouldCleanup={false}
      >
        {/* {TAB_PANELS[chatFolder]} */}
        <List />
      </Transition>
    </div>
  )
})

export {ChatFolders}
