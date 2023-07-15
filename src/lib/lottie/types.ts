import type { LottieRefCurrentProps } from 'lottie-react'
import type { RefObject } from 'preact'

import type { Size } from 'types/ui'

export type LottieAnimations = 'Monkey-track' | 'Monkey-peek' | 'Monkey-idle' | 'Empty-folder'

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
