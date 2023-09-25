import {type FC, memo, useCallback, useEffect, useMemo, useRef} from 'preact/compat'

import {getActions} from 'state/action'
import {connect} from 'state/connect'
import {selectOpenedChats} from 'state/selectors/chats'
import {selectChatMessageIds} from 'state/selectors/messages'
import {getGlobalState} from 'state/signal'

import {usePrevious} from 'hooks'
import {useBoolean} from 'hooks/useFlag'
import {useLayout} from 'hooks/useLayout'

import {t} from 'lib/i18n'
import {LottiePlayer} from 'lib/lottie'

import {MOCK_TWO_FA} from 'common/app'
import {addEscapeListener} from 'utilities/keyboardListener'
import {connectStateToNavigation} from 'utilities/routing'

import type {OpenedChat} from 'types/state'

import {TEST_ChangeLanguage} from 'components/test/ChangeLanguage'
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
  const {isSmall, isLaptop} = useLayout()
  const closeChat = useCallback(() => {
    document.body.classList.toggle('has-chat', false)
    document.body.classList.toggle('left-column-shown', true)

    /* if with animation - timeout, else just close...??? */
    if (isSmall && withAnimations) {
      setTimeout(() => {
        actions.openChat({id: undefined})
      }, 300)
    } else {
      actions.openChat({id: undefined})
    }
  }, [isSmall])
  useEffect(() => {
    // handleHashChangeTEST()
    const handleNavigation = connectStateToNavigation(global, actions, closeChat)

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
  const messagesIds = useMemo(
    () => selectChatMessageIds(global, 'c_740c5f09-e3da-423b-88e6-2cb73401f7ad'),
    []
  )
  const render = useRef(0)

  render.current += 1

  const {value: hidden, toggle} = useBoolean(true)
  return (
    <div class="MiddleColumn" id="middle-column">
      {/* <h3>Current chat:{global.openedChats[activeTransitionKey]?.chatId}</h3>
      <h3>Chats: {JSON.stringify(global.openedChats)}</h3> */}
      <Button
        onClick={() => {
          const theme = global.settings.general.theme

          actions.changeTheme(theme === 'dark' ? 'light' : 'dark')
        }}
      >
        Toggle theme. {global.settings.general.$theme}
      </Button>
      <Button
        onClick={() => {
          MOCK_TWO_FA.value = !MOCK_TWO_FA.value
        }}
      >
        Toggle mock 2fa
      </Button>
      {/* <SwitchLanguageTest /> */}
      <TEST_ChangeLanguage />
      <LottiePlayer autoplay loop name="love-letter" hidden={hidden} />
      <Button onClick={toggle}>Toggle</Button>
      {/* <img src={skeleton} /> */}
      <div>
        {/* {render.current} */}
        <p>{t('Privacy.WhoCanSendMessage')}</p>
        <p>{t('Privacy.WhoCanAddByPhone')}</p>
        <p>{t('Privacy.WhoCanInvite')}</p>
      </div>
      {/* {messagesIds && <InfiniteScroll messageIds={messagesIds} />} */}
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
