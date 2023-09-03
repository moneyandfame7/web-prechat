import type {FC} from 'preact/compat'

import clsx from 'clsx'

import type {ApiChat, ApiColorVariant, ApiUser} from 'api/types'

import {getSignalOr} from 'utilities/getSignalOr'
import {getInitials} from 'utilities/string/getInitials'

import type {SignalOr} from 'types/ui'

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
  isSavedMessages?: boolean
}

// передавати просто тут одразу peer.
export const AvatarTest: FC<AvatarTestProps> = ({
  fullName,
  variant = 'BLUE',
  size = 'm',
  shape = 'circular',
  isSavedMessages,
}) => {
  const renderContent = () => {
    if (isSavedMessages) {
      return <Icon name="savedMessages" />
    }

    return fullName ? getInitials(getSignalOr(fullName)) : undefined
  }
  const buildedClassname = clsx(`Avatar Avatar-${size} Avatar-${shape} Avatar-c-${variant}`, {
    'saved-messages': isSavedMessages,
  })
  return <div class={buildedClassname}>{renderContent()}</div>
}
