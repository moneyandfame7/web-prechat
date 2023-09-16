import {type FC, memo, useCallback} from 'preact/compat'

import type {ApiChat} from 'api/types'

import {getActions} from 'state/action'
import {isUserId} from 'state/helpers/users'

import {useFastClick} from 'hooks/useFastClick'
import {useLayout} from 'hooks/useLayout'

import {RightColumnScreens} from 'types/screens'

import {ColumnHeader} from 'components/ColumnHeader'
import {GroupChatInfo} from 'components/common/GroupChatInfo'
import {PrivateChatInfo} from 'components/common/PrivateChatInfo'
import {IconButton} from 'components/ui'

import './ChatHeader.scss'

interface OwnProps {
  chat: ApiChat
  onCloseChat: VoidFunction
}

export const ChatHeader: FC<OwnProps> = memo(({chat, onCloseChat}) => {
  const {openRightColumn} = getActions()
  const {isMobile, isLaptop} = useLayout()
  const handleClickHeader = useCallback(() => {
    openRightColumn({screen: RightColumnScreens.ChatProfile})
  }, [])

  function renderChatInfo() {
    return isUserId(chat.id) ? (
      <PrivateChatInfo userId={chat.id} />
    ) : (
      <GroupChatInfo chat={chat} />
    )
  }

  const shouldDisplayBtn = isLaptop || isMobile
  const clickHandlers = useFastClick(handleClickHeader)

  const isChatCollapsed = isLaptop
  return (
    <ColumnHeader className="chat-header">
      {shouldDisplayBtn && (
        <IconButton icon={isChatCollapsed ? 'close' : 'arrowLeft'} onClick={onCloseChat} />
      )}
      <div {...clickHandlers} class="chat-info-wrapper">
        {renderChatInfo()}
      </div>
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
