import {type FC, memo, useCallback, useEffect, useState} from 'preact/compat'

import {getActions} from 'state/action'
import {type MapState, connect} from 'state/connect'
import {selectChatFull} from 'state/selectors/chats'

import {addEscapeListener} from 'utilities/keyboardListener'

import {ChatEditScreens, RightColumnScreens} from 'types/screens'

import {SingleTransition, Transition} from 'components/transitions'

import ChatProfile from './ChatProfile.async'
import ChatSearch from './ChatSearch.async'
import ChatEdit from './chat-edit/ChatEdit.async'

import './RightColumn.scss'

interface OwnProps {}

interface StateProps {
  isChatOpen?: boolean

  isOpen: boolean
  activeScreen: RightColumnScreens
  chatId?: string
}
const RightColumnImpl: FC<OwnProps & StateProps> = ({
  isChatOpen,
  activeScreen,
  chatId,
  isOpen,
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
        return <ChatProfile chatId={chatId!} onCloseScreen={closeScreen} />
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
    }
  }
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
        name="slideDark"
      >
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

  return {
    isChatOpen,
    activeScreen,
    isOpen,
    chatFull,
    chatId,
  }
}
export const RightColumn = memo(connect(mapStateToProps)(RightColumnImpl))
