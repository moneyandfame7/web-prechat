import {type FC, memo, useCallback} from 'preact/compat'

import type {ApiChatFull, ApiChatMember, ApiUser} from 'api/types'

import {getActions} from 'state/action'
import {type MapState, connect} from 'state/connect'
import {getUserName, getUserStatus} from 'state/helpers/users'
import {
  selectCanEditChat,
  selectChatFull,
  selectChatMemberIds,
  selectIsPrivateChat,
} from 'state/selectors/chats'
import {selectUser} from 'state/selectors/users'
import {getGlobalState} from 'state/signal'

import {RightColumnScreens} from 'types/screens'

import {ColumnHeader} from 'components/ColumnHeader'
import {ColumnWrapper} from 'components/ColumnWrapper'
import {IconButton} from 'components/ui'
import {AvatarTest} from 'components/ui/AvatarTest'
import {ListItem} from 'components/ui/ListItem'

export interface ChatProfileProps {
  chatId: string
  onCloseScreen: (force?: boolean) => void
}
interface StateProps {
  chatFull?: ApiChatFull
  onlineCount?: number
  canEdit?: boolean
  user?: ApiUser
  memberIds: string[]
  members?: ApiChatMember[]
}
const ChatProfile: FC<ChatProfileProps & StateProps> = ({
  chatId,
  chatFull,
  canEdit,
  onCloseScreen,
  memberIds,
  members,
}) => {
  const global = getGlobalState()
  const {openRightColumn} = getActions()
  const onGoBack = useCallback(() => {
    onCloseScreen()
  }, [])

  const onEditChat = useCallback(() => {
    openRightColumn({screen: RightColumnScreens.ChatEdit})
  }, [])

  return (
    <ColumnWrapper
      goBackIcon="close"
      title="Profile"
      onGoBack={onGoBack}
      headerContent={<>{<IconButton icon="edit" onClick={onEditChat} />}</>}
    >
      Chat profile
      {members?.map((m) => {
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
      })}
    </ColumnWrapper>
  )
}

const mapStateToProps: MapState<ChatProfileProps, StateProps> = (state, ownProps) => {
  const isPrivate = selectIsPrivateChat(state, ownProps.chatId)
  const chatFull = isPrivate ? undefined : selectChatFull(state, ownProps.chatId)
  const user = isPrivate ? selectUser(state, ownProps.chatId) : undefined
  const canEdit = selectCanEditChat(state, ownProps.chatId)
  const memberIds = chatFull ? selectChatMemberIds(chatFull) : undefined
  return {
    chatFull,
    canEdit,
    user,
    memberIds,
    members: chatFull?.members,
  }
}

export default memo(connect(mapStateToProps)(ChatProfile))
