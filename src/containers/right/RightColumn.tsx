import {type FC, memo, useCallback, useEffect, useState} from 'preact/compat'

import {ApiUser} from 'api/types'

import {getActions} from 'state/action'
import {type MapState, connect} from 'state/connect'
import {getPreferredAnimations} from 'state/helpers/settings'
import {isUserId} from 'state/helpers/users'
import {selectChatFull, selectCurrentChat} from 'state/selectors/chats'
import {selectUser} from 'state/selectors/users'

import {addEscapeListener} from 'utilities/keyboardListener'

import {ChatEditScreens, RightColumnScreens} from 'types/screens'

import {SingleTransition, Transition} from 'components/transitions'

import ChatProfile from './ChatProfile.async'
import ChatSearch from './ChatSearch.async'
import ChatEdit from './chat-edit/ChatEdit.async'
import EditContact from './editContact.async'

import './RightColumn.scss'

interface OwnProps {}

interface StateProps {
  isChatOpen?: boolean

  isOpen: boolean
  activeScreen: RightColumnScreens
  chatId?: string
  user?: ApiUser
}
const RightColumnImpl: FC<OwnProps & StateProps> = ({
  isChatOpen,
  activeScreen,
  chatId,
  isOpen,
  user,
}) => {
  const {closeRightColumn, openRightColumn} = getActions()
  const [chatEditScreen, setChatEditScreen] = useState(ChatEditScreens.Main)
  useEffect(() => (isOpen ? addEscapeListener(closeRightColumn) : undefined))

  useEffect(() => {
    document.body.classList.toggle('right-column-shown', isOpen)
  }, [isOpen])

  const closeScreen = useCallback(
    (force = false) => {
      if (force) {
        openRightColumn({screen: RightColumnScreens.ChatProfile})
        return
      }
      switch (activeScreen) {
        case RightColumnScreens.ChatEdit:
          switch (ChatEditScreens) {
            default:
              setChatEditScreen(ChatEditScreens.Main)
              openRightColumn({screen: RightColumnScreens.ChatProfile})
          }
          break
        case RightColumnScreens.ChatProfile:
          closeRightColumn()
          break
        case RightColumnScreens.Search:
          openRightColumn({screen: RightColumnScreens.ChatEdit})
          break
      }
    },
    [activeScreen]
  )

  const renderScreen = () => {
    switch (activeScreen) {
      case RightColumnScreens.ChatProfile:
        return chatId && <ChatProfile chatId={chatId} onCloseScreen={closeScreen} />
      case RightColumnScreens.ChatEdit:
        return (
          <ChatEdit
            currentScreen={chatEditScreen}
            chatId={chatId!}
            onCloseScreen={closeScreen}
          />
        )
      case RightColumnScreens.Search:
        return <ChatSearch /* onCloseScreen={closeScreen} */ />
      // case RightColumnScreens.EditContact:
      //   return <EditContact user={user!} />
    }
  }

  // @todo select sessions for deleting
  // check telegram ios animations
  return (
    <SingleTransition
      unmount={!isChatOpen}
      className="right-column"
      toggle
      in={isOpen}
      appear
      name="slide"
    >
      <Transition
        containerClassname="right-column-inner"
        activeKey={activeScreen}
        name={getPreferredAnimations().page}
        innerClassnames={{
          [RightColumnScreens.ChatProfile]: 'chat-profile-container',
          [RightColumnScreens.ChatEdit]: 'chat-edit-container',
        }}
      >
        {/* <ChatProfile chatId={chatId!} onCloseScreen={closeScreen} /> */}
        {/* {chat && <ProfileAvatar peer={chat} />} */}
        {renderScreen()}
      </Transition>
    </SingleTransition>
  )
}

const mapStateToProps: MapState<OwnProps, StateProps> = (state) => {
  const isChatOpen = !!state.currentChat.chatId
  const chatId = state.currentChat.chatId

  const activeScreen = state.rightColumn.screen
  const isOpen = state.rightColumn.isOpen && isChatOpen
  if (!chatId) {
    return {
      isOpen: false,
      activeScreen,
    }
  }
  // const chat=selectChat(state,ch)
  const chatFull = selectChatFull(state, chatId)
  const test = selectCurrentChat(state)
  const user = test?.chatId
    ? isUserId(test.chatId)
      ? selectUser(state, test.chatId)
      : undefined
    : undefined
  return {
    isChatOpen,
    activeScreen,
    isOpen,
    chatFull,
    chatId,
    user,
  }
}
export const RightColumn = memo(connect(mapStateToProps)(RightColumnImpl))
