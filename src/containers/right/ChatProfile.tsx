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
  selectCanAddToContact,
  selectCanEditChat,
  selectChat,
  selectChatFull,
} from 'state/selectors/chats'
import {selectUser} from 'state/selectors/users'

// import {getGlobalState} from 'state/signal'
import {TEST_translate} from 'lib/i18n'

import {throttle} from 'utilities/schedulers/throttle'
import {stopEvent} from 'utilities/stopEvent'

import type {LanguagePackKeys} from 'types/lib'
import {ChatProfileScreens, RightColumnScreens} from 'types/screens'
import {PreactNode} from 'types/ui'

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
  // chatId,
  chatFull,
  canEdit,
  canAddToContact,
  onCloseScreen,
  user,
  // memberIds,
  // members,
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
      screen:
        /* user && user.isContact ? RightColumnScreens.EditContact : */ RightColumnScreens.ChatEdit,
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
  // const [isScrolling, setIsScrolling] = useState(false)

  // const contentScrollTop = testRef.current?.scrollTop
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
        console.log('NOT REFS')

        return
      }
      const contentScrollTop = Math.ceil(testRef.current.scrollTop)
      const tabListOffsetTop = tabListRef.current.offsetTop
      if (contentScrollTop < tabListOffsetTop) {
        console.log('IS PROFILE??? WHY', {contentScrollTop, tabListOffsetTop})

        setActiveTransitionKey(ChatProfileScreens.Profile)
      } else {
        /* if active tab members - set members, else shared media */
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
          // setIsScrolling(true)
          isScrollingRef.current = true
          testRef.current?.scrollTo({
            top: tabListRef.current?.offsetTop,
            // behavior: 'smooth',
          })
          setTimeout(() => {
            // setIsScrolling(false)
            isScrollingRef.current = false
          }, SCROLL_ANIMATION_MS)
        }
        break
      case ChatProfileScreens.Profile:
        if (contentScrollTop >= tabListOffsetTop) {
          // setIsScrolling(true)
          isScrollingRef.current = true

          testRef.current?.scrollTo({
            top: 0,
            // behavior: 'smooth',
          })
          setTimeout(() => {
            isScrollingRef.current = false

            // setIsScrolling(false)
          }, SCROLL_ANIMATION_MS)
        }
    }

    // setLastScrollTop(contentScrollTop)
  }, [activeTransitionKey])
  useLayoutEffect(() => {
    testRef.current?.scrollTo({top: 0 /* , behavior: 'instant' */})
  }, [chatId])
  const jumpToProfile = () => {
    setActiveTransitionKey(ChatProfileScreens.Profile)
  }

  const renderColumnIcon = () => {
    // ;<Transition
    //   timeout={500}
    //   activeKey={activeTransitionKey}
    //   name="rotate"
    //   shouldCleanup={false}
    // >
    return (
      <IconButton
        ripple={false}
        animationTimeout={400}
        onClick={activeTransitionKey === ChatProfileScreens.Profile ? onGoBack : jumpToProfile}
        icon={activeTransitionKey === ChatProfileScreens.Profile ? 'close' : 'arrowLeft'}
        animation="rotate"
      />
    )
    // </Transition>
  }

  // const canEdit = (!!user && !user.isSelf) || isChannel || isGro
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
          {/* <IconButton
            onClick={
              activeTransitionKey === ChatProfileScreens.Profile ? onGoBack : jumpToProfile
            }
            icon={activeTransitionKey === ChatProfileScreens.Profile ? 'close' : 'arrowLeft'}
          /> */}
          {renderHeader}
          {/* <p class="column-header__title">{renderHeader}</p>
          {canEdit && !canAddToContact && <IconButton icon="edit" onClick={handleEditChat} />}
          {canAddToContact && <IconButton icon="addUser" onClick={handleAddContact} />} */}
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

        {/* <ScreenLoader fullHeight={false} />
       
        <ScreenLoader fullHeight={false} /> */}
      </Transition>
      {/* Chat profile */}
      {/* {chatFull ? (
        members?.map((m) => {
          // const member=selectChatMemb
          const user = selectUser(global, m.userId)
          const title = m.customTitle || m.isOwner ? 'owner' : m.isAdmin ? 'admin' : undefined

          const fullname = user ? getUserName(user) : undefined
          const subtitle = user ? getUserStatus(user) : undefined
          return (
            <ListItem title={fullname} subtitle={subtitle} additional={title} key={m.userId}>
              <AvatarTest
                size="s"
                fullName={user ? getUserName(user) : undefined}
                variant={user?.color}
              />
            </ListItem>
          )
        })
      ) : (
        <ScreenLoader fullHeight={false} />
      )} */}
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
