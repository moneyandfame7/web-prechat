import type { FC} from 'preact/compat';
import { memo, useEffect, useRef } from 'preact/compat'

import type { LottieRefCurrentProps } from 'lottie-react'
import clsx from 'clsx'

// import animationData from 'assets/animations/TwoFactorSetupMonkeyPeek.json'
import { reverseNegativeNumber } from 'utilities/reverseNegativeNumber'

import { usePrevious } from 'hooks'

import { logDebugWarn } from 'lib/logger'

import { LottiePlayer } from 'lib/lottie'
import type { Size } from 'types/ui'

import './Monkey.scss'

const MONKEY_PASS_TRACK_FRAMES_COUNT = 180
// const MONKEY_PASS_SEE_FRAMES_COUNT = 33
// const INPUT_LENGTH = 20
// const MONKEY_FIRST_SEGMENT_ON_INPUT = 18
const MONKEY_LAST_SEGMENT_ON_INPUT = 160

interface AnimationSegments {
  firstS: number
  secondS: number
  speed: number
}
/**
 * @todo Зробити так, щоб на перший символ мавпа опускалась вниз, на останній лише дивилась вниз?
 */
interface MonkeyProps {
  size?: Size
  maxLength: number
  currentLength: number
  loading: boolean
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
// const monkeys: Record<MonkeyName, Promise<Record<any, any>>> = {
//   idle: import('assets/animations/TwoFactorSetupMonkeyIdle.json').then((m) => m.default),
//   pry: import('assets/animations/TwoFactorSetupMonkeyPeek.json').then((m) => m.default),
//   track: import('assets/animations/Monkey-track.json').then((m) => m.default)
// }

const Monkey: FC<MonkeyProps> = ({ loading, size = 'small', maxLength, currentLength }) => {
  const monkeyRef = useRef<LottieRefCurrentProps>(null)
  const ref = useRef<AnimationSegments>({ firstS: 0, secondS: 0, speed: 2 })
  const FRAGMENTS = MONKEY_LAST_SEGMENT_ON_INPUT / maxLength
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const previousLength = usePrevious(currentLength)

  useEffect(() => {
    switch (true) {
      case FRAGMENTS > 20 && FRAGMENTS < 40:
        monkeyRef.current?.setSpeed(2)
        ref.current.speed = 2
        break
      case FRAGMENTS > 40 && FRAGMENTS < 80:
        monkeyRef.current?.setSpeed(4)
        ref.current.speed = 4
        break
      case FRAGMENTS > 80:
        monkeyRef.current?.setSpeed(6)
        ref.current.speed = 6
        break
    }

    logDebugWarn(`[UI]: Monkey FRAGMENTS: ${FRAGMENTS}`)
  }, [FRAGMENTS])

  useEffect(() => {
    if (
      (typeof previousLength === 'undefined' && currentLength === 0) ||
      currentLength === previousLength
    ) {
      return
    }

    const firstSegment = previousLength! * FRAGMENTS
    /* if currentLength===1 secondSegment+=...or smth like */
    const secondSegment = currentLength! * FRAGMENTS
    if (
      firstSegment >= MONKEY_PASS_TRACK_FRAMES_COUNT ||
      secondSegment >= MONKEY_PASS_TRACK_FRAMES_COUNT
    ) {
      return
    }
    monkeyRef.current?.playSegments([firstSegment, secondSegment], true)

    if (reverseNegativeNumber(currentLength - previousLength!) >= 4) {
      monkeyRef.current?.setSpeed(20)
    } else if (monkeyRef.current?.animationItem?.playSpeed === 20) {
      monkeyRef.current?.setSpeed(ref.current.speed)
    }
  }, [previousLength, currentLength])

  const buildedClass = clsx('Monkey', `Monkey-${size}`)

  return (
    <LottiePlayer
      size={size}
      loading={loading}
      name="Empty-folder"
      autoplay
      loop
      lottieRef={monkeyRef}
      className={buildedClass}
    />
  )
}
export default memo(Monkey)
