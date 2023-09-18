import {type FC, memo, useCallback, useEffect} from 'preact/compat'

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

  // const isNext = useRef(false)
  const {value, toggle} = useBoolean(false)
  // const [loaded, setLoaded] = useState(false)
  return (
    <div class="MiddleColumn">
      {/* {renderChat()} */}
      {/* <img
        // height={700}
        onLoadCapture={(e) => {
          const test = e.currentTarget.getBoundingClientRect()
          console.log({test})
        }}
        style={{
          opacity: loaded ? 1 : 0,
          transition: '0.3s opacity ease',
        }}
        src="https://plus.unsplash.com/premium_photo-1694822449585-a2444c288b96?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2787&q=80"
        alt="l"
        onLoad={(e) => {
          setLoaded(true)
          // console.log
          console.log('END')
        }}
      /> */}
      <Button
        onClick={() => {
          const theme = global.settings.general.theme
          actions.changeTheme(theme === 'dark' ? 'light' : 'dark')
        }}
      >
        Change theme
      </Button>

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
      {/* {useParseEmoji('🇺🇦')} */}
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
