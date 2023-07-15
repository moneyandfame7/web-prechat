import { useCallback, useEffect, useLayoutEffect, useState } from 'preact/hooks'
import type { FC, TargetedEvent } from 'preact/compat'

import Lottie from 'lottie-react'
import clsx from 'clsx'

import { useInactivePage } from 'hooks'

import type { LottiePlayerProps } from './types'
import { getFallback } from './helpers'

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
  isPausable
}) => {
  const [animationData, setAnimationData] = useState<unknown>()
  const [isPaused, setIsPaused] = useState(lottieRef.current?.animationItem?.isPaused)
  useLayoutEffect(() => {
    import(`../../assets/animations/${name}.json`).then((module) =>
      setAnimationData(module.default)
    )
  }, [])

  const stopAnimationOnBlur = useCallback(() => {
    if (withBlur && !hidden) lottieRef.current?.pause()
  }, [])
  const playAnimationOnFocus = useCallback(() => {
    if (withBlur && !hidden) lottieRef.current?.play()
  }, [])

  useEffect(() => {
    /**
     * visibility change for stop
     */
    document.addEventListener('visibilitychange', (e) => {
      if (!hidden) {
      }
    })
  }, [hidden])
  const pauseOnClick = (e: TargetedEvent<HTMLDivElement, Event>) => {
    e.preventDefault()
    if (isPaused) {
      lottieRef.current?.play()
      setIsPaused(false)
    } else {
      lottieRef.current?.pause()
      setIsPaused(true)
    }
  }

  useInactivePage({ onBlur: stopAnimationOnBlur, onFocus: playAnimationOnFocus })

  const playerHidden = loading || !animationData /* || !lottieRef.current */

  const fallbackClass = clsx('Lottie-fallback', `Lottie-fallback_${size}`)

  const playerClass = clsx(
    'Lottie-player',
    `Lottie-player_${size}`,
    `Lottie-player_${name}`,
    {
      'Lottie-player_hidden': playerHidden || hidden,
      'Lottie-player_pausable': isPausable
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

  return (
    <>
      {playerHidden && !hidden && <div class={fallbackClass}>{getFallback(name)}</div>}

      <Lottie
        onClick={isPausable ? pauseOnClick : undefined}
        lottieRef={lottieRef}
        loop={loop}
        autoplay={false}
        className={playerClass}
        animationData={animationData}
        rendererSettings={{ className: 'Lottie-player_svg' }}
      />
    </>
  )
}
