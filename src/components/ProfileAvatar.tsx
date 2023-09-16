import {type FC, memo} from 'preact/compat'

import type {ApiChat, ApiUser} from 'api/types'

import {getPeerName} from 'state/helpers/chats'

import {getInitials} from 'utilities/string/getInitials'

import './ProfileAvatar.scss'

interface ProfileAvatarProps {
  peer: ApiChat | ApiUser
}
export const ProfileAvatar: FC<ProfileAvatarProps> = memo(({peer}) => {
  const renderPhoto = () => {
    if (peer?.photo) {
      return <img src={peer.photo.url} alt="Profile avatar" width={200} height={200} />
    }

    return (
      <div class={`ProfileAvatar Avatar-c-${peer?.color}`}>
        {peer && getInitials(getPeerName(peer))}
      </div>
    )
  }
  return <>{renderPhoto()}</>
})
