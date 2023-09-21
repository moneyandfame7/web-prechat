import {useSignal} from '@preact/signals'
import {type FC, type TargetedEvent, memo, useCallback, useEffect, useRef} from 'preact/compat'

import type {ApiChat} from 'api/types'

import {getActions} from 'state/action'
import {connect} from 'state/connect'
import {
  selectChat,
  selectCurrentChat,
  selectCurrentOpenedChat,
  selectOpenedChats,
} from 'state/selectors/chats'
import {getGlobalState} from 'state/signal'

import {usePrevious} from 'hooks'
import {useBoolean} from 'hooks/useFlag'
import {useLayout} from 'hooks/useLayout'

import {IS_EMOJI_SUPPORTED} from 'common/environment'
import {EMOJI_REGEX, getEmojiUnified} from 'utilities/emoji'
import {addEscapeListener} from 'utilities/keyboardListener'
import {connectStateToNavigation} from 'utilities/routing'

import {OpenedChat} from 'types/state'
import type {PreactNode} from 'types/ui'

import {InfiniteScroll} from 'components/InfiniteScroll'
import {Transition} from 'components/transitions'
import {Button} from 'components/ui'

import {ChatHeader} from './ChatHeader'
import {ChatInput} from './ChatInput'
import {MessagesList} from './MessagesList'
import {getCleanupExceptionKey} from './helpers/getCleanupExceptionKey'

import './MiddleColumn.scss'

interface OwnProps {}
interface StateProps {
  // currentChat?: ApiChat
  chatId?: string
  activeTransitionKey: number
}

type InjectedProps = OwnProps & StateProps

const withAnimations = !document.documentElement.classList.contains('animation-none')
const MiddleColumn: FC<InjectedProps> = ({chatId, activeTransitionKey}) => {
  const global = getGlobalState()
  const actions = getActions()
  const {isMobile, isLaptop} = useLayout()
  const closeChat = useCallback(() => {
    document.body.classList.toggle('has-chat', false)
    document.body.classList.toggle('left-column-shown', true)

    /* if with animation - timeout, else just close...??? */
    if (isMobile && withAnimations) {
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
  const isChatOpen = !!chatId
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
  const prevTransitionKey = usePrevious(activeTransitionKey)
  const cleanupExceptionKey = getCleanupExceptionKey(activeTransitionKey, prevTransitionKey)
  // const cleanupExceptionKey = (
  //   prevTransitionKey !== undefined && prevTransitionKey < currentTransitionKey ? prevTransitionKey : undefined
  // );
  return (
    <div class="MiddleColumn">
      {/* <h3>Current chat:{global.openedChats[activeTransitionKey]?.chatId}</h3>
      <h3>Chats: {JSON.stringify(global.openedChats)}</h3> */}
      <Button
        onClick={() => {
          const theme = global.settings.general.theme
          actions.changeTheme(theme === 'dark' ? 'light' : 'dark')
        }}
      >
        Toggle theme.
      </Button>
      {isChatOpen && (
        <>
          <ChatHeader
            activeTransitionKey={activeTransitionKey}
            chatId={chatId}
            onCloseChat={closeChat}
          />

          <Transition
            timeout={450}
            cleanupException={cleanupExceptionKey}
            activeKey={activeTransitionKey}
            name="slide"
            shouldCleanup
          >
            <div class="future-transition-container">
              <MessagesList chatId={chatId} />
              <ChatInput chatId={chatId} />
            </div>
          </Transition>
        </>
      )}
    </div>
  )
}

export default memo(
  connect<OwnProps, StateProps>((state) => {
    const openedChats = selectOpenedChats(state)

    const openedChat: OpenedChat | undefined = openedChats[openedChats.length - 1]

    return {
      chatId: openedChat?.chatId,
      activeTransitionKey: Math.max(0, openedChats.length - 1),
    }
  })(MiddleColumn)
)
