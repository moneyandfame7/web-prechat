import type {ApiAvatarVariant} from 'api/types/users'
import type {FC} from 'preact/compat'

import {getInitials} from 'utilities/string/getInitials'

import './AvatarTest.scss'

export type AvatarSize = 'xl' | 'l' | 'm' | 's' | 'xs'
export type AvatarShape = 'rounded' | 'circular'

interface AvatarTestProps {
  fullName?: string
  size?: AvatarSize
  variant?: ApiAvatarVariant
  shape?: AvatarShape
}
export const AvatarTest: FC<AvatarTestProps> = ({
  fullName,
  variant = 'BLUE',
  size = 'm',
  shape = 'circular'
}) => {
  const initials = fullName ? getInitials(fullName) : undefined

  const buildedClassname = `Avatar Avatar-${size} Avatar-${shape} Avatar-c-${variant}`
  return <div class={buildedClassname}>{initials}</div>
}
