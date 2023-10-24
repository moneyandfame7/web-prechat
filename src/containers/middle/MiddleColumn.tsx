import {type FC, memo, useCallback, useEffect, useRef} from 'preact/compat'

import {getActions} from 'state/action'
import {connect} from 'state/connect'
import {selectOpenedChats} from 'state/selectors/chats'
import {selectHasMessageEditing, selectHasMessageSelection} from 'state/selectors/diff'
import {selectPinnedMessageIds} from 'state/selectors/messages'
import {getGlobalState} from 'state/signal'

import {usePrevious} from 'hooks'
import {useBoolean} from 'hooks/useFlag'
import {useLayout} from 'hooks/useLayout'

import {addEscapeListener} from 'utilities/keyboardListener'
import {connectStateToNavigation} from 'utilities/routing'

import type {OpenedChat} from 'types/state'

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
  const render = useRef(0)
  render.current += 1
  return (
    <div class="MiddleColumn" id="middle-column">
      <Button
        onClick={() => {
          global.stories.isOpen = !global.stories.isOpen
        }}
      >
        Toggle stories
        {render.current}
      </Button>
      {/* <Transition3d /> */}
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
              <MessagesList chatId={chatId} isPinnedList={isPinnedList} />
              <ChatInput
                hasPinnedMessages={!!pinnedMessagesCount}
                isPinnedList={isPinnedList}
                emojiMenuOpen={isEmojiMenuOpen}
                onToggleEmojiMenu={toggleEmojiMenu}
                onCloseEmojiMenu={closeEmojiMenu}
                chatId={chatId}
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

    const openedChat = openedChats[openedChats.length - 1] as OpenedChat | undefined
    const animationsEnabled = state.settings.general.animationsEnabled
    const pinnedMessagesCount = openedChat?.chatId
      ? selectPinnedMessageIds(state, openedChat?.chatId)?.length
      : undefined
    return {
      chatId: openedChat?.chatId,
      activeTransitionKey: Math.max(0, openedChats.length - 1),
      animationsEnabled,
      isPinnedList: openedChat?.isPinnedList,
      pinnedMessagesCount,
      hasMessageSelection: selectHasMessageSelection(state),
      hasMessageEditing: selectHasMessageEditing(state),
    }
  })(MiddleColumn)
)
