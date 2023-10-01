import type {Signal} from '@preact/signals'
import {type FC, memo, useEffect, useRef} from 'preact/compat'

import {LottiePlayer, type LottieRefCurrentProps} from 'lib/lottie'

import type {Size} from 'types/ui'

import {MONKEY_PASS_SEE_FIRST_SEGMENT, MONKEY_PASS_SEE_LAST_SEGMENT} from './helpers'

interface MonkeyPasswordProps {
  see: Signal<boolean>
  size?: Size
}
export const MonkeyPassword: FC<MonkeyPasswordProps> = memo(({see, size = 'medium'}) => {
  const monkeyRef = useRef<LottieRefCurrentProps>(null)

  useEffect(() => {
    if (see.value) {
      monkeyRef.current?.playSegments(
        [MONKEY_PASS_SEE_FIRST_SEGMENT, MONKEY_PASS_SEE_LAST_SEGMENT],
        true
      )
    } else {
      monkeyRef.current?.playSegments(
        [MONKEY_PASS_SEE_LAST_SEGMENT, MONKEY_PASS_SEE_FIRST_SEGMENT],
        true
      )
    }
  }, [see.value])
  return (
    <LottiePlayer
      withBlur={false}
      size={size}
      lottieRef={monkeyRef}
      name="Monkey-peek"
      loop={false}
      autoplay={false}
      loading={false}
    />
  )
})
