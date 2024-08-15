import {type FC, type RefObject, memo, useEffect, useRef, useState} from 'preact/compat'

import {usePrevious} from 'hooks'

import {LottiePlayer, type LottieRefCurrentProps} from 'lib/lottie'

import type {Size} from 'types/ui'

import {MONKEY_TRACK_FRAMES, MONKEY_TRACK_LAST_SEGMENT_ON_INPUT} from './helpers'

interface AnimationSegments {
  speed: number
}
interface MonkeyTrackProps {
  size?: Size
  maxLength: number
  inputRef: RefObject<HTMLInputElement>
  currentLength: number
}
export const MonkeyTrack: FC<MonkeyTrackProps> = memo(
  ({maxLength, size = 'medium', inputRef, currentLength}) => {
    const monkeyRef = useRef<LottieRefCurrentProps>(null)
    const monkeyRefIdle = useRef<LottieRefCurrentProps>(null)
    const segmentsRef = useRef<AnimationSegments>({
      speed: 2,
    })
    const previousLength = usePrevious(currentLength)
    const [isIdle, setIsIdle] = useState(true)

    const FRAGMENTS = MONKEY_TRACK_LAST_SEGMENT_ON_INPUT / maxLength
    useEffect(() => {
      switch (true) {
        case FRAGMENTS > 20 && FRAGMENTS < 40:
          monkeyRef.current?.setSpeed(2)
          segmentsRef.current.speed = 2
          break

        case FRAGMENTS > 40 && FRAGMENTS < 80:
          monkeyRef.current?.setSpeed(4)
          segmentsRef.current.speed = 4
          break

        case FRAGMENTS > 80:
          monkeyRef.current?.setSpeed(6)
          segmentsRef.current.speed = 6
          break
      }
    }, [FRAGMENTS])

    useEffect(() => {
      if (
        (typeof previousLength === 'undefined' && currentLength === 0) ||
        currentLength === previousLength ||
        !inputRef.current
      ) {
        return
      }

      let firstSegment = previousLength! * FRAGMENTS
      let secondSegment = currentLength! * FRAGMENTS

      if (firstSegment >= MONKEY_TRACK_FRAMES || secondSegment >= MONKEY_TRACK_FRAMES) {
        if (currentLength === 0) {
          firstSegment = MONKEY_TRACK_LAST_SEGMENT_ON_INPUT
          secondSegment = 0
        } else {
          return
        }
      }

      monkeyRef.current?.playSegments([firstSegment, secondSegment], true)

      if (currentLength === 0) {
        setIsIdle(true)
      } else {
        setIsIdle(false)
      }
    }, [previousLength, currentLength])

    useEffect(() => {
      if (!inputRef.current) return

      inputRef.current.onblur = () => {
        setIsIdle(true)
        monkeyRefIdle.current?.play()
      }
    }, [])
    return (
      <>
        <LottiePlayer
          hidden={!isIdle}
          withBlur
          size={size}
          lottieRef={monkeyRefIdle}
          name="Monkey-idle"
          loop
          autoplay
          loading={false}
          isPausable
        />
        <LottiePlayer
          hidden={isIdle}
          withBlur={false}
          size={size}
          lottieRef={monkeyRef}
          name="Monkey-track"
          loop={false}
          autoplay={false}
          loading={false}
        />
      </>
    )
  }
)
