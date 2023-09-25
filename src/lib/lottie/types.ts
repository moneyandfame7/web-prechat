import type {RefObject} from 'preact'

import type {LottieRefCurrentProps} from 'lottie-react'

import type {ANIMATED_SESSION_ICONS} from 'state/helpers/account'

import type {Size} from 'types/ui'

type DeviceAnimations = `Device-${(typeof ANIMATED_SESSION_ICONS)[number]}`
export type LottieAnimations =
  | 'Monkey-track'
  | 'Monkey-peek'
  | 'Monkey-idle'
  | 'Empty-folder'
  | 'keychain'
  | 'two-fa-hint'
  | 'celebrations'
  | 'email-recovery'
  | 'love-letter'
  | 'party-man'
  | DeviceAnimations

export interface LottiePlayerProps {
  name: LottieAnimations
  lottieRef?: RefObject<LottieRefCurrentProps>
  loop?: boolean
  autoplay?: boolean
  className?: string
  loading?: boolean
  withBlur?: boolean
  size?: Size
  hidden?: boolean
  isPausable?: boolean
}
