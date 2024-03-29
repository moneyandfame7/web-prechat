import {type FC, memo, useCallback, useEffect, useMemo, useRef} from 'preact/compat'

import {VList, VListHandle, WVList} from 'virtua'

import {ApiMessage, HistoryDirection} from 'api/types'

import {getActions} from 'state/action'
import {connect} from 'state/connect'
import {getLastOutgoingMessage} from 'state/helpers/messages'
import {selectOpenedChats} from 'state/selectors/chats'
import {selectHasMessageEditing, selectHasMessageSelection} from 'state/selectors/diff'
import {
  selectChatMessageIds,
  selectMessages,
  selectPinnedMessageIds,
} from 'state/selectors/messages'
import {getGlobalState} from 'state/signal'

import {usePrevious} from 'hooks'
import {useBoolean} from 'hooks/useFlag'
import {useLayout} from 'hooks/useLayout'

import {addEscapeListener, addKeyboardListeners} from 'utilities/keyboardListener'
import {deepClone} from 'utilities/object/deepClone'
import {connectStateToNavigation} from 'utilities/routing'

import type {OpenChats} from 'types/state'

import {InfiniteScroll} from 'components/InfiniteScroll'
import {Photo} from 'components/common/Photo'
import {InfiniteScrollTest} from 'components/test/InfiniteScrollTest'
import {Transition} from 'components/transitions'

import {ChatHeader} from './ChatHeader'
import {ChatInput} from './ChatInput'
import {MessagesList} from './MessagesList'
import {getCleanupExceptionKey} from './helpers/getCleanupExceptionKey'

import './MiddleColumn.scss'

interface OwnProps {}
interface StateProps {
  // currentChat?: ApiChat
  chatId?: string
  messagesById?: Record<string, ApiMessage>
  activeTransitionKey: number
  animationsEnabled: boolean
  isPinnedList: boolean | undefined
  pinnedMessagesCount: number | undefined
  hasMessageSelection: boolean
  hasMessageEditing: boolean
}

type InjectedProps = OwnProps & StateProps

const MiddleColumn: FC<InjectedProps> = ({
  chatId,
  messagesById,
  activeTransitionKey,
  animationsEnabled,
  isPinnedList,
  pinnedMessagesCount,
  hasMessageSelection,
  hasMessageEditing,
}) => {
  const infiniteScrollRef = useRef<VListHandle>(null)

  const global = getGlobalState()
  const actions = getActions()
  const {isSmall, isLaptop} = useLayout()

  const {
    value: isEmojiMenuOpen,
    toggle: toggleEmojiMenu,
    setFalse: closeEmojiMenu,
  } = useBoolean()
  const closeChat = useCallback(() => {
    document.body.classList.toggle('has-chat', false)
    document.body.classList.toggle('left-column-shown', true)
    closeEmojiMenu()

    /* if with animation - timeout, else just close...??? */
    if (isSmall && animationsEnabled) {
      setTimeout(() => {
        actions.openChat({id: undefined})
        actions.toggleMessageSelection({active: false})
      }, 300)
    } else {
      actions.openChat({id: undefined})
      actions.toggleMessageSelection({active: false})
      actions.toggleMessageEditing({active: false})
    }
  }, [isSmall, animationsEnabled])
  useEffect(() => {
    // handleHashChangeTEST()
    const handleNavigation = connectStateToNavigation(global, actions /* closeChat */)

    handleNavigation()
    window.addEventListener('hashchange', handleNavigation)

    return () => {
      window.removeEventListener('hashchange', handleNavigation)
    }
  }, [closeChat, isSmall])
  const isChatOpen = !!chatId
  const isChatCollapsed = isLaptop && isChatOpen
  useEffect(() => {
    // if (!isMobile) {
    //   document.body.classList.remove('left-column-shown')

    //   // return
    // }
    if (isSmall) {
      document.body.classList.toggle('left-column-shown', !isChatOpen)
    }
    document.body.classList.toggle('chat-collapsed', isChatCollapsed)
    document.body.classList.toggle('has-chat', isChatOpen)
  }, [isChatOpen, isChatCollapsed, isSmall])

  /**
   * @todo подивитись завтра анімації, швидко поклацати і схуялі воно не працює так як мені треба.... можливт треба transform десь прописати?
   * @todo Reconnect in 3, 2, 1 seconds - for apollo
   */
  useEffect(
    () =>
      isChatOpen
        ? addEscapeListener(() => {
            if (hasMessageSelection || hasMessageEditing) {
              actions.toggleMessageSelection({active: false})
              actions.toggleMessageEditing({active: false})
            } else {
              closeChat()
            }
          })
        : undefined,
    [isChatOpen, hasMessageSelection, hasMessageEditing]
  )

  useEffect(() => {
    // if(has)
    actions.toggleMessageSelection({active: false})
    actions.toggleMessageEditing({active: false})
  }, [chatId])

  // const isNext = useRef(false)
  const prevTransitionKey = usePrevious(activeTransitionKey)
  const cleanupExceptionKey = getCleanupExceptionKey(activeTransitionKey, prevTransitionKey)
  // const cleanupExceptionKey = (
  //   prevTransitionKey !== undefined && prevTransitionKey < currentTransitionKey ? prevTransitionKey : undefined
  // );

  return (
    <div class="MiddleColumn" id="middle-column">
      {/* <InfiniteScrollTest /> */}
      {/* <Photo
        url="https://plus.unsplash.com/premium_photo-1695582867991-e75f29ab5a2a?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        blurHash="U9RfRkbXIV_3LzRjRQsp4TozspMyNGfjR*Rj"
        alt=""
        interactive
        canAutoLoad={false}
        withSpoiler
        height={300}
        width={300}
      /> */}
      {isChatOpen && (
        <>
          <ChatHeader
            pinnedMessagesCount={pinnedMessagesCount}
            isPinnedList={isPinnedList}
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
              <MessagesList
                chatId={chatId}
                isPinnedList={isPinnedList}
                infiniteScrollRef={infiniteScrollRef}
              />
              <ChatInput
                hasPinnedMessages={!!pinnedMessagesCount}
                isPinnedList={isPinnedList}
                emojiMenuOpen={isEmojiMenuOpen}
                onToggleEmojiMenu={toggleEmojiMenu}
                onCloseEmojiMenu={closeEmojiMenu}
                chatId={chatId}
                infiniteScrollRef={infiniteScrollRef}
              />
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
    const openedChat = openedChats[openedChats.length - 1] as OpenChats | undefined

    const messagesById = openedChat?.chatId
      ? selectMessages(state, openedChat?.chatId)
      : undefined

    const animationsEnabled = state.settings.general.animationsEnabled
    const pinnedMessagesCount = openedChat?.chatId
      ? selectPinnedMessageIds(state, openedChat?.chatId)?.length
      : undefined
    return {
      chatId: openedChat?.chatId,
      messagesById,
      activeTransitionKey: Math.max(0, openedChats.length - 1),
      animationsEnabled,
      isPinnedList: openedChat?.isPinnedList,
      pinnedMessagesCount,
      hasMessageSelection: selectHasMessageSelection(state),
      hasMessageEditing: selectHasMessageEditing(state),
    }
  })(MiddleColumn)
)
