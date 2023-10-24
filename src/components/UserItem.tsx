import {type FC, memo} from 'preact/compat'

import clsx from 'clsx'

import type {ApiUser} from 'api/types'

import {connect} from 'state/connect'
import {getPeerRoute} from 'state/helpers/chats'
import {getUserName, getUserStatus} from 'state/helpers/users'
import {selectUser} from 'state/selectors/users'

import {AvatarTest} from './ui/AvatarTest'
import {ListItem} from './ui/ListItem'

import './UserItem.scss'

interface StateProps {
  user: ApiUser | undefined
}
interface OwnProps {
  userId: string
  isContactList?: boolean
  withUrl?: boolean
}

const UserItemImpl: FC<StateProps & OwnProps> = ({user, withUrl}) => {
  // const userStatus=useMemo(()=>getUserStatus(user))

  const buildedClass = clsx('user-item', {
    'is-online': user?.status?.type === 'userStatusOnline',
  })
  return user ? (
    <ListItem
      href={withUrl ? getPeerRoute(user) : undefined}
      className={buildedClass}
      title={getUserName(user)}
      subtitle={getUserStatus(user)}
    >
      <AvatarTest peer={user} />
    </ListItem>
  ) : null
}

export const UserItem = memo(
  connect<OwnProps, StateProps>((state, ownProps) => ({
    user: selectUser(state, ownProps.userId),
  }))(UserItemImpl)
)
