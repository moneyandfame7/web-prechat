import type {FC} from 'preact/compat'

import clsx from 'clsx'

import type {ApiChat, ApiColorVariant, ApiUser} from 'api/types'

import {getSignalOr} from 'utilities/getSignalOr'
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
  peer?: ApiChat | ApiUser
  userId?: string
  isSavedMessages?: boolean
  onlineBadge?: boolean
}

// передавати просто тут одразу peer.
export const AvatarTest: FC<AvatarTestProps> = ({
  fullName,
  variant = 'BLUE',
  size = 'm',
  shape = 'circular',
  isSavedMessages,
  userId,
  onlineBadge,
}) => {
  const renderContent = () => {
    if (isSavedMessages) {
      return <Icon name="savedMessages" />
    }

    return (
      <>
        {fullName && getInitials(getSignalOr(fullName))}

        <SingleTransition in={onlineBadge} name="zoomFade" className="online-badge-transition">
          <span class="online-badge" />
        </SingleTransition>
      </>
    )
  }

  const buildedClassname = clsx(`Avatar Avatar-${size} Avatar-${shape} Avatar-c-${variant}`, {
    'saved-messages': isSavedMessages,
  })
  return <div class={buildedClassname}>{renderContent()}</div>
}
