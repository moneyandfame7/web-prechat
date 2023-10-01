import {type FC, memo, useCallback, useEffect, useState} from 'preact/compat'

import {getActions} from 'state/action'
import {getPreferredAnimations} from 'state/helpers/settings'

import {type TabItem, TabList} from 'components/common/tabs/TabList'
import {Transition} from 'components/transitions'

import {ChatList} from './ChatList'

import './ChatFolders.scss'

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

const ChatFolders: FC = memo(() => {
  const {getChatFolders} = getActions()
  const [chatFolder, setCurrentChatFolder] = useState(0)

  useEffect(() => {
    getChatFolders()
  }, [])

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
        innerClassnames="chat-folder-tab"
        // timeout={0}
        name={getPreferredAnimations().chatFolders}
        activeKey={chatFolder}
        shouldCleanup={false}
      >
        {/* {TAB_PANELS[chatFolder]} */}
        <ChatList />
      </Transition>
    </div>
  )
})

export {ChatFolders}
