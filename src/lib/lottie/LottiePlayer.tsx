import type {FC, TargetedEvent} from 'preact/compat'
import {useCallback, useEffect, useLayoutEffect, useState} from 'preact/hooks'

import clsx from 'clsx'
import {useInactivePage} from 'hooks'
import Lottie from 'lottie-react'

import {timeout} from 'utilities/schedulers/timeout'

import {getFallback} from './helpers'
import type {LottiePlayerProps} from './types'

import './LottiePlayer.scss'

export const LottiePlayer: FC<LottiePlayerProps> = ({
  loading,
  name,
  lottieRef,
  autoplay,
  loop,
  withBlur,
  className,
  size = 'medium',
  hidden,
  isPausable,
}) => {
  const [animationData, setAnimationData] = useState<unknown>()
  const [isPaused, setIsPaused] = useState(lottieRef.current?.animationItem?.isPaused)
  const playerHidden = loading || !animationData /* || !lottieRef.current */

  useLayoutEffect(() => {
    // import(`../../assets/animations/${name}.json`).then((module) =>
    //   setAnimationData(module.default)
    // )
    import(`../../assets/animations/${name}.json`).then((m) => setAnimationData(m.default))
  }, [])

  const stopAnimationOnBlur = useCallback(() => {
    if (withBlur && !hidden) lottieRef.current?.pause()
  }, [])
  const playAnimationOnFocus = useCallback(() => {
    if (withBlur && !hidden) lottieRef.current?.play()
  }, [])

  const pauseOnClick = useCallback(
    (e: TargetedEvent<HTMLDivElement, Event>) => {
      e.preventDefault()

      if (isPaused) {
        lottieRef.current?.play()
        setIsPaused(false)
      } else {
        lottieRef.current?.pause()
        setIsPaused(true)
      }
    },
    [isPaused]
  )

  useInactivePage({onBlur: stopAnimationOnBlur, onFocus: playAnimationOnFocus})

  const fallbackClass = clsx('Lottie-fallback', `Lottie-fallback_${size}`)

  const playerClass = clsx(
    'Lottie-player',
    `Lottie-player_${size}`,
    `Lottie-player_${name}`,
    {
      'Lottie-player_hidden': playerHidden || hidden,
      'Lottie-player_pausable': isPausable,
    },
    className
  )

  useEffect(() => {
    if (!autoplay) {
      return
    }
    if (playerHidden) {
      lottieRef.current?.pause()
    } else {
      lottieRef.current?.play()
    }
  }, [playerHidden])
  // const elRef = useRef<{base: HTMLDivElement}>(null)

  return (
    <>
      {playerHidden && !hidden && (
        <div class={fallbackClass}>
          <img src={getFallback(name)} alt="Fallback player" />
        </div>
      )}

      <Lottie
        // ref={elRef}
        onClick={isPausable ? pauseOnClick : undefined}
        lottieRef={lottieRef}
        loop={loop}
        autoplay={false}
        className={playerClass}
        animationData={animationData}
        rendererSettings={{className: 'Lottie-player_svg'}}
      />
    </>
  )
}
