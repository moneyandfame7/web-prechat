import type {RefObject} from 'preact'

import type {LottieRefCurrentProps} from 'lottie-react'

import type {Size} from 'types/ui'

import type {ANIMATED_SESSION_ICONS} from 'containers/left/settings/helpers'

type DeviceAnimations = `Device-${(typeof ANIMATED_SESSION_ICONS)[number]}`
export type LottieAnimations =
  | 'Monkey-track'
  | 'Monkey-peek'
  | 'Monkey-idle'
  | 'Empty-folder'
  | DeviceAnimations

export interface LottiePlayerProps {
  name: LottieAnimations
  lottieRef: RefObject<LottieRefCurrentProps>
  loop: boolean
  autoplay: boolean
  className?: string
  loading: boolean
  withBlur?: boolean
  size: Size
  hidden?: boolean
  isPausable?: boolean
}
