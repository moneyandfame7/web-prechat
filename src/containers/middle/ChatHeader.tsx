import {type FC, memo, useCallback} from 'preact/compat'

import type {ApiChat} from 'api/types'

import {getActions} from 'state/action'
import {isUserId} from 'state/helpers/users'

import {usePrevious} from 'hooks'
import {useFastClick} from 'hooks/useFastClick'
import {useLayout} from 'hooks/useLayout'

import {RightColumnScreens} from 'types/screens'

import {ColumnHeader} from 'components/ColumnHeader'
import {GroupChatInfo} from 'components/common/GroupChatInfo'
import {PrivateChatInfo} from 'components/common/PrivateChatInfo'
import {Transition} from 'components/transitions'
import {IconButton, type IconName} from 'components/ui'

import {getCleanupExceptionKey} from './helpers/getCleanupExceptionKey'

import './ChatHeader.scss'

interface OwnProps {
  chatId: string
  onCloseChat: VoidFunction
  activeTransitionKey: number
}

export const ChatHeader: FC<OwnProps> = memo(({chatId, onCloseChat, activeTransitionKey}) => {
  const {openRightColumn, openPreviousChat} = getActions()
  const {isSmall, isLaptop} = useLayout()
  const handleClickHeader = useCallback(() => {
    openRightColumn({screen: RightColumnScreens.ChatProfile})
  }, [])

  function renderChatInfo() {
    return isUserId(chatId) ? (
      <PrivateChatInfo userId={chatId} withOnlineStatus withTypingStatus />
    ) : (
      <GroupChatInfo chatId={chatId} />
    )
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
        cleanupException={cleanupExceptionKey}
        activeKey={activeTransitionKey}
        name="slideFade"
      >
        {backBtnIcon && <IconButton icon={backBtnIcon} onClick={handleGoBack} />}
        <div {...clickHandlers} class="chat-info-wrapper">
          {renderChatInfo()}
        </div>
      </Transition>
    </ColumnHeader>
  )
})

// const mapStateToProps: MapState<OwnProps, StateProps> = (state, ownProps) => {
//   const chat = selectChat(state, ownProps.chatId)

//   return {
//     chat,
//   }
// }

// export const ChatHeader = memo(connect(mapStateToProps)(ChatHeaderImpl))
