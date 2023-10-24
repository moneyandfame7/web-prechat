import {type FC, memo} from 'preact/compat'

import type {ApiChat, ApiUser} from 'api/types'

import {getPeerName} from 'state/helpers/chats'
import {getUserStatus, isUserId} from 'state/helpers/users'
import {isChatChannel} from 'state/selectors/chats'

import {TEST_translate} from 'lib/i18n'

import {getInitials} from 'utilities/string/getInitials'

import {Photo} from './common/Photo'

import './ProfileAvatar.scss'

interface ProfileAvatarProps {
  peer: ApiChat | ApiUser
}
export const ProfileAvatar: FC<ProfileAvatarProps> = memo(({peer}) => {
  const isUser = isUserId(peer.id)
  const user = isUser ? (peer as ApiUser) : undefined
  const chat = !isUser ? (peer as ApiChat) : undefined
  const isChannel = chat && isChatChannel(chat)

  function renderPeerStatus() {
    if (isUser) {
      return getUserStatus(user!)
    }
    return chat?.membersCount
      ? TEST_translate(isChannel ? 'SubscribersCount' : 'MembersCount', {
          count: chat?.membersCount,
        })
      : undefined
  }
  const renderPhoto = () => {
    if (peer?.photo) {
      return (
        <div class="profile-avatar">
          <Photo
            alt="User profile avatar"
            width="100%"
            height={240}
            url={peer.photo.url}
            blurHash={peer.photo.blurHash}
          />
          <div class="profile-avatar-info">
            <span class="peer-title">{getPeerName(peer)}</span>
            <span class="peer-subtitle">{renderPeerStatus()}</span>
          </div>
        </div>
      )
      // return <img src={peer.photo.url} alt="Profile avatar" width={200} height={200} />
    }

    return (
      <div class={`profile-avatar Avatar-c-${peer?.color}`}>
        {peer && getInitials(getPeerName(peer))}
      </div>
    )
  }
  return <>{renderPhoto()}</>
})
