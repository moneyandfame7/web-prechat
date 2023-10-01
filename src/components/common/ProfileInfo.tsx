import {type FC, memo} from 'preact/compat'

import clsx from 'clsx'

import type {ApiChatFull, ApiUser} from 'api/types'

import {type MapState, connect} from 'state/connect'

import {ProfileAvatar} from 'components/ProfileAvatar'

interface OwnProps {
  chatFull?: ApiChatFull
  user?: ApiUser
}
interface StateProps {
  isSavedMessages?: boolean
}

const ProfileInfoImpl: FC<OwnProps & StateProps> = ({user, isSavedMessages}) => {
  const buildedClass = clsx('profile-info', {
    'is-me': isSavedMessages,
  })

  return <div class={buildedClass}>{user && <ProfileAvatar peer={user} />}</div>
}

const mapStateToProps: MapState<OwnProps, StateProps> = (_, ownProps) => {
  return {
    isSavedMessages: ownProps.user?.isSelf,
  }
}

export const ProfileInfo = memo(connect(mapStateToProps)(ProfileInfoImpl))
