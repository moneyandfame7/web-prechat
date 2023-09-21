import type {FC} from 'preact/compat'

import clsx from 'clsx'

import type {ApiChat, ApiColorVariant, ApiPeer, ApiUser} from 'api/types'

import {getChatName} from 'state/helpers/chats'
import {getUserName, isUserId} from 'state/helpers/users'
import {isUserOnline} from 'state/selectors/users'

import {useFastClick} from 'hooks/useFastClick'

// import {getSignalOr} from 'utilities/getSignalOr'
import {getInitials} from 'utilities/string/getInitials'

import type {SignalOr} from 'types/ui'

import {SingleTransition} from 'components/transitions'

import {Icon} from '.'

import './AvatarTest.scss'

export type AvatarSize = 'xl' | 'l' | 'm' | 's' | 'xs'
export type AvatarShape = 'rounded' | 'circular'

interface AvatarTestProps {
  fullName?: SignalOr<string>
  size?: AvatarSize
  variant?: ApiColorVariant
  shape?: AvatarShape
  chat?: ApiChat
  userId?: string
  isSavedMessages?: boolean
  onlineBadge?: boolean
  text?: string
  peer?: ApiPeer
  withOnlineStatus?: boolean
  onClick?: VoidFunction
}

// передавати просто тут одразу peer.
export const AvatarTest: FC<AvatarTestProps> = ({
  // fullName,
  variant = 'BLUE',
  size = 'm',
  shape = 'circular',
  // chat,
  isSavedMessages,
  peer,
  withOnlineStatus,
  text,
  onClick,
}) => {
  const isUser = peer && isUserId(peer.id)
  const user = isUser ? peer && (peer as ApiUser) : undefined
  const chat = !isUser && peer ? (peer as ApiChat) : undefined
  const userStatus = withOnlineStatus && user ? isUserOnline(user) : undefined

  const renderContent = () => {
    let textAvatar: string | undefined = text
    if (isSavedMessages) {
      return <Icon name="savedMessages" />
    } else if (chat) {
      textAvatar = getChatName(chat)

      // return getInitials(title)
    } else if (user) {
      textAvatar = getUserName(user)

      // return getInitials(fullName)
    }

    return textAvatar ? getInitials(textAvatar) : undefined
  }

  const avatarVariant = user?.color || chat?.color || variant
  const buildedClassname = clsx(
    `Avatar Avatar-${size} Avatar-${shape} Avatar-c-${avatarVariant}`,
    {
      'saved-messages': isSavedMessages,
    }
  )

  const clickHandlers = useFastClick(onClick, true)
  return (
    <div {...clickHandlers} class={buildedClassname}>
      {renderContent()}
      {withOnlineStatus && (
        <SingleTransition in={userStatus} name="zoomFade" className="online-badge-transition">
          <span class="online-badge" />
        </SingleTransition>
      )}
    </div>
  )
}
