import type {FC} from 'preact/compat'
import clsx from 'clsx'

import type {ApiAvatar, ApiUser} from 'types/api'

import {getInitials} from 'utilities/getFirstLetters'

import './Avatar.scss'

interface AvatarProps {
  user?: ApiUser
  avatar?: ApiAvatar
}
export const Avatar: FC<AvatarProps> = ({url, user, avatar}) => {
  const userFullname = user?.firstName + ' ' + user?.lastName || ''

  const buildedClass = clsx('Avatar')

  console.log({avatar})
  return (
    <div class={buildedClass}>
      <span class="initials">{getInitials(userFullname)}</span>
      {/* <img class="Avatar" src={url} alt="Avatar" /> */}
    </div>
  )
}
