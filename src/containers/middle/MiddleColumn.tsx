import {type FC, memo, useCallback, useEffect, useRef} from 'preact/compat'

import type {VListHandle} from 'virtua'

import type {ApiMessage} from 'api/types'

import {getActions} from 'state/action'
import {connect} from 'state/connect'
import {selectOpenedChats} from 'state/selectors/chats'
import {selectHasMessageEditing, selectHasMessageSelection} from 'state/selectors/diff'
import {selectMessages, selectPinnedMessageIds} from 'state/selectors/messages'
import {getGlobalState} from 'state/signal'

import {usePrevious} from 'hooks'
import {useBoolean} from 'hooks/useFlag'
import {useLayout} from 'hooks/useLayout'

import {addEscapeListener} from 'utilities/keyboardListener'
import {connectStateToNavigation} from 'utilities/routing'

import type {OpenChats} from 'types/state'

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

  const isChatOpen = !!chatId
  const isChatCollapsed = isLaptop && isChatOpen

  const prevTransitionKey = usePrevious(activeTransitionKey)
  const cleanupExceptionKey = getCleanupExceptionKey(activeTransitionKey, prevTransitionKey)

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

  useEffect(() => {
    if (isSmall) {
      document.body.classList.toggle('left-column-shown', !isChatOpen)
    }
    document.body.classList.toggle('chat-collapsed', isChatCollapsed)
    document.body.classList.toggle('has-chat', isChatOpen)
  }, [isChatOpen, isChatCollapsed, isSmall])

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

  return (
    <div class="MiddleColumn" id="middle-column">
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
            <div class="messages-transition-container">
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
