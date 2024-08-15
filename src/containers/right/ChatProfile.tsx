import {
  type FC,
  memo,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'preact/compat'

import type {ApiChat, ApiChatFull, ApiChatMember, ApiUser} from 'api/types'

import {getActions} from 'state/action'
import {type MapState, connect} from 'state/connect'
import {isUserId} from 'state/helpers/users'
import {
  getChatMemberIds,
  isChatChannel,
  selectCanEditChat,
  selectChat,
  selectChatFull,
} from 'state/selectors/chats'
import {selectUser} from 'state/selectors/users'

import {TEST_translate} from 'lib/i18n'

import {throttle} from 'utilities/schedulers/throttle'

import type {LanguagePackKeys} from 'types/lib'
import {ChatProfileScreens, RightColumnScreens} from 'types/screens'
import type {PreactNode} from 'types/ui'

import {ColumnWrapper} from 'components/ColumnWrapper'
import {ScreenLoader} from 'components/ScreenLoader'
import {ProfileInfo} from 'components/common/ProfileInfo'
import {TabList} from 'components/common/tabs/TabList'
import {Transition} from 'components/transitions'
import {IconButton} from 'components/ui'

export interface ChatProfileProps {
  chatId: string
  onCloseScreen: (force?: boolean) => void
}
interface StateProps {
  chatFull?: ApiChatFull
  onlineCount?: number
  canEdit?: boolean
  canAddToContact: boolean
  user?: ApiUser
  chat?: ApiChat
  memberIds?: string[]
  members?: ApiChatMember[]
  isChannel?: boolean
}

const handleScrollThrottled = throttle((cb) => cb(), 250, false)

// hardcode...
const SCROLL_ANIMATION_MS = 470
const ChatProfile: FC<ChatProfileProps & StateProps> = ({
  chatFull,
  canEdit,
  canAddToContact,
  onCloseScreen,
  user,
  isChannel,
  chat,
  chatId,
}) => {
  const isScrollingRef = useRef(false)
  const testRef = useRef<HTMLDivElement>(null)
  const tabListRef = useRef<HTMLDivElement>(null)

  const {openRightColumn, openAddContactModal} = getActions()
  const onGoBack = useCallback(() => {
    onCloseScreen()
  }, [])
  const [activeTransitionKey, setActiveTransitionKey] = useState<ChatProfileScreens>(
    ChatProfileScreens.Profile
  )
  const [activeTab, setActiveTab] = useState(0)

  const handleEditChat = useCallback(() => {
    openRightColumn({
      screen: RightColumnScreens.ChatEdit,
    })
  }, [user])
  const handleAddContact = useCallback(() => {
    if (user) {
      openAddContactModal({userId: user.id})
    }
  }, [user])
  const renderHeader = useMemo(() => {
    let key: LanguagePackKeys
    let content: PreactNode | null
    switch (activeTransitionKey) {
      case ChatProfileScreens.Members:
        key = 'GroupMembers'
        content = null
        break
      case ChatProfileScreens.SharedMedia:
        key = 'ChatInfo.SharedMedia'
        content = null

        break
      case ChatProfileScreens.Profile:
        if (user) {
          key = 'UserInfo'
        } else if (isChannel) {
          key = 'ChannelInfo'
        } else {
          key = 'GroupInfo'
        }
        content = (
          <>
            {canEdit && !canAddToContact && (
              <IconButton icon="edit" onClick={handleEditChat} />
            )}
            {canAddToContact && <IconButton icon="addUser" onClick={handleAddContact} />}
          </>
        )
    }

    return (
      <>
        <p class="column-header__title">{TEST_translate(key)}</p>
        {content}
      </>
    )
  }, [activeTransitionKey, user, isChannel])

  const handleChangeTab = (idx: number) => {
    setActiveTransitionKey(ChatProfileScreens.SharedMedia)
    setActiveTab(idx)
  }

  const handleScrollColumn = (/* e: Event */) => {
    if (isScrollingRef.current) {
      return
    }

    void handleScrollThrottled(() => {
      if (!testRef.current || !tabListRef.current) {
        return
      }
      const contentScrollTop = Math.ceil(testRef.current.scrollTop)
      const tabListOffsetTop = tabListRef.current.offsetTop
      if (contentScrollTop < tabListOffsetTop) {
        setActiveTransitionKey(ChatProfileScreens.Profile)
      } else {
        setActiveTransitionKey(ChatProfileScreens.SharedMedia)
      }
    })
  }
  useEffect(() => {
    if (!testRef.current || !tabListRef.current) {
      return
    }
    const contentScrollTop = testRef.current.scrollTop
    const tabListOffsetTop = tabListRef.current.offsetTop
    switch (activeTransitionKey) {
      case ChatProfileScreens.Members:
      case ChatProfileScreens.SharedMedia:
        if (contentScrollTop < tabListOffsetTop) {
          isScrollingRef.current = true
          testRef.current?.scrollTo({
            top: tabListRef.current?.offsetTop,
          })
          setTimeout(() => {
            isScrollingRef.current = false
          }, SCROLL_ANIMATION_MS)
        }
        break
      case ChatProfileScreens.Profile:
        if (contentScrollTop >= tabListOffsetTop) {
          isScrollingRef.current = true

          testRef.current?.scrollTo({
            top: 0,
          })
          setTimeout(() => {
            isScrollingRef.current = false
          }, SCROLL_ANIMATION_MS)
        }
    }
  }, [activeTransitionKey])
  useLayoutEffect(() => {
    testRef.current?.scrollTo({top: 0 /* , behavior: 'instant' */})
  }, [chatId])
  const jumpToProfile = () => {
    setActiveTransitionKey(ChatProfileScreens.Profile)
  }

  const renderColumnIcon = () => {
    return (
      <IconButton
        ripple={false}
        animationTimeout={400}
        onClick={activeTransitionKey === ChatProfileScreens.Profile ? onGoBack : jumpToProfile}
        icon={activeTransitionKey === ChatProfileScreens.Profile ? 'close' : 'arrowLeft'}
        animation="rotate"
      />
    )
  }

  const renderColumnHeader = () => {
    return (
      <>
        {renderColumnIcon()}
        <Transition
          timeout={500}
          activeKey={activeTransitionKey}
          name="slideFade"
          shouldCleanup={false}
        >
          {renderHeader}
        </Transition>
      </>
    )
  }

  return (
    <ColumnWrapper
      replaceHeader
      onScroll={handleScrollColumn}
      contentRef={testRef}
      goBackIcon="close"
      withHeaderBorder={false}
      // title={columnTitle}
      onGoBack={onGoBack}
      headerContent={renderColumnHeader()}
    >
      <ProfileInfo chat={chat} user={user} chatFull={chatFull} />
      <TabList
        tabListRef={tabListRef}
        activeTab={activeTab}
        onChange={handleChangeTab}
        tabs={[
          {
            title: 'First',
          },
          {
            title: 'Second',
          },
          {
            title: 'Third',
          },
        ]}
      />
      <Transition
        timeout={500}
        containerClassname="shared-media"
        name="slide"
        activeKey={activeTab}
      >
        <ScreenLoader fullHeight={false} />
      </Transition>
    </ColumnWrapper>
  )
}

const mapStateToProps: MapState<ChatProfileProps, StateProps> = (state, ownProps) => {
  const chat = selectChat(state, ownProps.chatId)
  const isPrivate = isUserId(ownProps.chatId)
  const isChannel = chat && isChatChannel(chat)
  const chatFull = isPrivate ? undefined : selectChatFull(state, ownProps.chatId)
  const user = isPrivate ? selectUser(state, ownProps.chatId) : undefined
  const canEdit = selectCanEditChat(state, ownProps.chatId)
  const canAddToContact = !!user && !user?.isContact
  const memberIds = chatFull ? getChatMemberIds(chatFull) : undefined

  // const peer=isUserId(ownProps.chatId)
  return {
    chatFull,
    canEdit,
    canAddToContact,
    user,
    chat,
    memberIds,
    members: chatFull?.members,
    isChannel,
    onlineCount: 0,
  }
}

export default memo(connect(mapStateToProps)(ChatProfile))
