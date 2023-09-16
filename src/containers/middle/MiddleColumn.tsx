import {type FC, memo, useCallback, useEffect, useRef, useState} from 'preact/compat'

import type {ApiChat} from 'api/types'

import {getActions} from 'state/action'
import {connect} from 'state/connect'
import {selectCurrentChat} from 'state/selectors/chats'
import {getGlobalState} from 'state/signal'

import {useBoolean} from 'hooks/useFlag'
import {useLayout} from 'hooks/useLayout'

import {addEscapeListener} from 'utilities/keyboardListener'
import {connectStateToNavigation} from 'utilities/routing'

import EmojiPicker from 'components/common/emoji-picker/EmojiPicker.async'
import UpdateAppPopup from 'components/popups/UpdateAppPopup'
import {Button, IconButton} from 'components/ui'

import {ChatHeader} from './ChatHeader'
import {ChatInput} from './ChatInput'
import {MessagesList} from './MessagesList'

import './MiddleColumn.scss'

interface OwnProps {}
interface StateProps {
  currentChat?: ApiChat
}

type InjectedProps = OwnProps & StateProps
const MiddleColumn: FC<InjectedProps> = ({currentChat}) => {
  const global = getGlobalState()
  const actions = getActions()
  const {isMobile, isLaptop} = useLayout()
  const closeChat = useCallback(() => {
    document.body.classList.toggle('has-chat', false)
    document.body.classList.toggle('left-column-shown', true)

    /* if with animation - timeout, else just close...??? */
    if (isMobile) {
      setTimeout(() => {
        actions.openChat({id: undefined})
      }, 300)
    } else {
      actions.openChat({id: undefined})
    }
  }, [isMobile])
  useEffect(() => {
    // handleHashChangeTEST()
    const handleNavigation = connectStateToNavigation(global, actions, closeChat)

    handleNavigation()
    window.addEventListener('hashchange', handleNavigation)

    return () => {
      window.removeEventListener('hashchange', handleNavigation)
    }
  }, [closeChat, isMobile])
  const isChatOpen = !!currentChat
  const isChatCollapsed = isLaptop && isChatOpen
  useEffect(() => {
    // if (!isMobile) {
    //   document.body.classList.remove('left-column-shown')

    //   // return
    // }
    if (isMobile) {
      document.body.classList.toggle('left-column-shown', !isChatOpen)
    }
    document.body.classList.toggle('chat-collapsed', isChatCollapsed)
    document.body.classList.toggle('has-chat', isChatOpen)
  }, [isChatOpen, isChatCollapsed, isMobile])

  /**
   * @todo подивитись завтра анімації, швидко поклацати і схуялі воно не працює так як мені треба.... можливт треба transform десь прописати?
   * @todo Reconnect in 3, 2, 1 seconds - for apollo
   */
  useEffect(() => {
    return isChatOpen
      ? addEscapeListener(() => {
          closeChat()
        })
      : undefined
  }, [isChatOpen])

  const isNext = useRef(false)
  const {value, toggle} = useBoolean(false)
  return (
    <div class="MiddleColumn">
      {/* {renderChat()} */}
      <EmojiPicker isOpen={value} />
      <IconButton icon="smile" onClick={toggle} />
      {isChatOpen && (
        <>
          <ChatHeader chat={currentChat} onCloseChat={closeChat} />
          {/* <Transition
              activeKey={currentChatId}
              name="slideFade"
              direction={isNext.current ? 1 : -1}
            ></Transition> */}
          {/* {currentChat.id} */}
          <Button
            onClick={() => {
              actions.changeTheme(global.settings.general.theme === 'dark' ? 'light' : 'dark')
            }}
          >
            TOGGLE_THEME
          </Button>
          {/* <div class="chat-container"> */}
          <MessagesList chat={currentChat} />
          <ChatInput chatId={currentChat.id} />
          {/* </div> */}
        </>
      )}

      {/*
       * ChatHeader
       * MessagesList
       * Input?
       */}
    </div>
  )
}

export default memo(
  connect<OwnProps, StateProps>((state) => {
    const currentChat = selectCurrentChat(state)
    if (!currentChat) {
      return {}
    }
    return {
      currentChat,
    }
  })(MiddleColumn)
)
