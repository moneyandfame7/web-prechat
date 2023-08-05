import type {FC} from 'preact/compat'
import clsx from 'clsx'

import type {ApiUser} from 'types/api'

import {getInitials} from 'utilities/getFirstLetters'

import './Avatar.scss'

interface AvatarProps {
  user?: ApiUser
}
export const Avatar: FC<AvatarProps> = ({user}) => {
  const userFullname = user?.firstName + ' ' + user?.lastName || ''

  const buildedClass = clsx('Avatar', `Avatar-${user?.fullInfo?.avatar.avatarVariant}`)
  console.log(user, 'AVATAR')
  return (
    <div class={buildedClass}>
      <span class="initials">{getInitials(userFullname)}</span>
      {/* <img class="Avatar" src={url} alt="Avatar" /> */}
    </div>
  )
}
