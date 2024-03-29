import {type FC, memo} from 'preact/compat'

import type {ApiChatMember, ApiUser} from 'api/types'

import {type MapState, connect} from 'state/connect'
import {getUserStatus} from 'state/helpers/users'
import {selectUser} from 'state/selectors/users'

import {useIsOnline} from 'hooks/useIsOnline'

import {Transition} from 'components/transitions'
import {type AvatarSize, AvatarTest} from 'components/ui/AvatarTest'
import {Dots} from 'components/ui/Dots'

import {FullNameTitle} from './FullNameTitle'

interface OwnProps {
  userId: string
  showSelf?: boolean
  avatarSize?: AvatarSize
  withOnlineStatus?: boolean
  withTypingStatus?: boolean
  chatMember?: ApiChatMember
}

interface StateProps {
  user?: ApiUser
  isSavedMessages?: boolean
  userStatus?: string
}
const PrivateChatInfoImpl: FC<OwnProps & StateProps> = ({
  avatarSize = 's',
  user,
  isSavedMessages,
  userStatus,
}) => {
  const isOnline = useIsOnline()

  function renderChatStatus() {}
  return (
    <div class="chat-info private">
      {/* <ListItem
        withRipple={false}
        title={<FullNameTitle peer={user!} isSavedMessages={isSavedMessages} />}
        subtitle={userStatus}
      > */}
      {user && (
        <AvatarTest
          variant={user?.color}
          isSavedMessages={isSavedMessages}
          size={avatarSize}
          peer={user}
        />
      )}
      {user && (
        <div class="chat-info__container">
          <FullNameTitle peer={user} isSavedMessages={isSavedMessages} />
          <p class="list-item__subtitle">
            <Transition activeKey={isOnline ? 0 : 1} name="slideFadeY">
              {!isOnline ? <Dots text="waiting network status" /> : userStatus}
            </Transition>
          </p>
        </div>
      )}
      {/* </ListItem> */}
    </div>
  )
}

const mapStateToProps: MapState<OwnProps, StateProps> = (
  state,
  {userId, showSelf = false, withOnlineStatus /* withTypingStatus */}
) => {
  const user = selectUser(state, userId)
  if (!user) {
    return {}
  }
  const isSavedMessages = user.isSelf && !showSelf
  // const isOnline = !isSavedMessages && user && isUserOnline(user)
  const userStatus = withOnlineStatus
    ? isSavedMessages
      ? 'chat with yourself'
      : getUserStatus(user)
    : undefined
  return {
    user,
    userStatus,
    isSavedMessages,
  }
}

export const PrivateChatInfo = memo(connect(mapStateToProps)(PrivateChatInfoImpl))
