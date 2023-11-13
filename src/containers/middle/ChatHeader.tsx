import {type FC, memo, useCallback} from 'preact/compat'

import {getActions} from 'state/action'
import {isUserId} from 'state/helpers/users'

import {usePrevious} from 'hooks'
import {useFastClick} from 'hooks/useFastClick'
import {useIsOnline} from 'hooks/useIsOnline'
import {useLayout} from 'hooks/useLayout'

import {TEST_translate} from 'lib/i18n'

import {RightColumnScreens} from 'types/screens'

import {ColumnHeader} from 'components/ColumnHeader'
import {GroupChatInfo} from 'components/common/GroupChatInfo'
import {PrivateChatInfo} from 'components/common/PrivateChatInfo'
import {Transition} from 'components/transitions'
import {IconButton, type IconName} from 'components/ui'

import {ChatUtils} from './ChatUtils'
import {getCleanupExceptionKey} from './helpers/getCleanupExceptionKey'

import './ChatHeader.scss'

interface OwnProps {
  chatId: string
  onCloseChat: VoidFunction
  activeTransitionKey: number
  isPinnedList?: boolean
  pinnedMessagesCount: number | undefined
}

export const ChatHeader: FC<OwnProps> = memo(
  ({chatId, onCloseChat, activeTransitionKey, isPinnedList, pinnedMessagesCount}) => {
    const {openRightColumn, openPreviousChat} = getActions()
    const {isSmall, isLaptop} = useLayout()
    const handleClickHeader = useCallback(() => {
      openRightColumn({screen: RightColumnScreens.ChatProfile})
    }, [])
    function renderChatInfo() {
      if (isPinnedList) {
        /* залупа, треба переробити */
        return (
          <p class="text-bold">
            {pinnedMessagesCount
              ? TEST_translate('PinnedMessagesCount', {count: pinnedMessagesCount})
              : TEST_translate('PinnedMessagesTitle')}
          </p>
        )
      }
      return isUserId(chatId) ? (
        <PrivateChatInfo userId={chatId} withOnlineStatus withTypingStatus />
      ) : (
        <GroupChatInfo chatId={chatId} />
      )
      // return chatId
      // {chatId}
    }

    function handleGoBack() {
      // 0 - means that no have prev history of opened chats
      if (activeTransitionKey === 0) {
        onCloseChat()
      } else {
        openPreviousChat()
      }
    }
    const clickHandlers = useFastClick(handleClickHeader)

    const backBtnIcon: IconName | undefined =
      activeTransitionKey === 0 && isLaptop
        ? 'close'
        : activeTransitionKey === 1 || isSmall
        ? 'arrowLeft'
        : undefined

    const prevTransitionKey = usePrevious(activeTransitionKey)
    const cleanupExceptionKey = getCleanupExceptionKey(activeTransitionKey, prevTransitionKey)
    return (
      <ColumnHeader className="chat-header">
        <Transition
          timeout={350}
          shouldCleanup
          cleanupException={cleanupExceptionKey}
          activeKey={activeTransitionKey}
          name="slideFade"
        >
          {backBtnIcon && <IconButton icon={backBtnIcon} onClick={handleGoBack} />}
          <div {...clickHandlers} class="chat-info-wrapper">
            {renderChatInfo()}
          </div>
          {!isPinnedList && <ChatUtils chatId={chatId} />}
        </Transition>
      </ColumnHeader>
    )
  }
)

// const mapStateToProps: MapState<OwnProps, StateProps> = (state, ownProps) => {
//   const chat = selectChat(state, ownProps.chatId)
//   const user = isUserId(ownProps.chatId) ? selectUser(state, ownProps.chatId) : undefined
//   return {
//     chat,
//     user,
//   }
// }

// export const ChatHeader = memo(connect(mapStateToProps)(ChatHeaderImpl))
