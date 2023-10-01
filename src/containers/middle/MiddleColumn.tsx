import {
  ChangeEvent,
  type FC,
  TargetedEvent,
  memo,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'preact/compat'

import {Api} from 'api/manager'

import {getActions} from 'state/action'
import {connect} from 'state/connect'
import {selectOpenedChats} from 'state/selectors/chats'
import {getGlobalState} from 'state/signal'

import {usePrevious} from 'hooks'
import {useBoolean} from 'hooks/useFlag'
import {useLayout} from 'hooks/useLayout'

import {addEscapeListener} from 'utilities/keyboardListener'
import {connectStateToNavigation} from 'utilities/routing'

import type {OpenedChat} from 'types/state'

import {Transition} from 'components/transitions'
import {Transition3d} from 'components/transitions/Transition3d'
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
}

type InjectedProps = OwnProps & StateProps

const MiddleColumn: FC<InjectedProps> = ({chatId, activeTransitionKey, animationsEnabled}) => {
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
      }, 300)
    } else {
      actions.openChat({id: undefined})
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
            closeChat()
          })
        : undefined,
    [isChatOpen]
  )

  // const isNext = useRef(false)
  const prevTransitionKey = usePrevious(activeTransitionKey)
  const cleanupExceptionKey = getCleanupExceptionKey(activeTransitionKey, prevTransitionKey)
  // const cleanupExceptionKey = (
  //   prevTransitionKey !== undefined && prevTransitionKey < currentTransitionKey ? prevTransitionKey : undefined
  // );

  const render = useRef(0)

  render.current += 1
  const [imgUrl, setImgUrl] = useState<string | null>(null)

  // const {}=useBoo
  const handleChangeInput = async (e: TargetedEvent<HTMLInputElement, ChangeEvent>) => {
    const file = e.currentTarget?.files?.[0]
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader()

      reader.onloadend = () => {
        setImgUrl(reader.result as any)
      }

      reader.readAsDataURL(file)

      const data = await Api.account.uploadProfilePhoto(file)

      console.log({data})
    }
  }
  const handleSendTest = () => {}
  return (
    <div class="MiddleColumn" id="middle-column">
      <input type="file" onChange={handleChangeInput} />
      {imgUrl && <img src={imgUrl} />}
      {/* {messagesIds && <InfiniteScroll messageIds={messagesIds} />} */}
      <Button
        onClick={() => {
          global.stories.isOpen = !global.stories.isOpen
        }}
      >
        Toggle stories
      </Button>
      <Transition3d />
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
              <ChatInput
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

    const openedChat: OpenedChat | undefined = openedChats[openedChats.length - 1]
    const animationsEnabled = state.settings.general.animationsEnabled
    return {
      chatId: openedChat?.chatId,
      activeTransitionKey: Math.max(0, openedChats.length - 1),
      animationsEnabled,
    }
  })(MiddleColumn)
)
