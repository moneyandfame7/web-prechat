import type {FC, TargetedEvent} from 'preact/compat'
import {useCallback, useEffect, useLayoutEffect, useRef, useState} from 'preact/hooks'

import clsx from 'clsx'
import Lottie, {type LottieRefCurrentProps} from 'lottie-react'

import {useInactivePage} from 'hooks'

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
  let _lottieRef = useRef<LottieRefCurrentProps>(null)
  if (lottieRef) {
    _lottieRef = lottieRef
  }

  const [animationData, setAnimationData] = useState<unknown>()
  const [isPaused, setIsPaused] = useState(_lottieRef.current?.animationItem?.isPaused)
  const playerHidden = loading || !animationData /* || !lottieRef.current */

  useLayoutEffect(() => {
    // import(`../../assets/animations/${name}.json`).then((module) =>
    //   setAnimationData(module.default)
    // )
    import(`../../assets/animations/${name}.json`).then((m) => setAnimationData(m.default))
  }, [])

  const stopAnimationOnBlur = useCallback(() => {
    if (withBlur && !hidden) _lottieRef.current?.pause()
  }, [])
  const playAnimationOnFocus = useCallback(() => {
    if (withBlur && !hidden) _lottieRef.current?.play()
  }, [])

  const pauseOnClick = (e: TargetedEvent<HTMLDivElement, MouseEvent>) => {
    e.preventDefault()
    console.log('PAUSE???', isPaused)
    if (isPaused) {
      _lottieRef.current?.play()
      setIsPaused(false)
    } else {
      _lottieRef.current?.pause()
      setIsPaused(true)
    }
  }

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
      _lottieRef.current?.pause()
    } else {
      _lottieRef.current?.play()
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

      {/* @ts-expect-error Preact types confused */}
      <Lottie
        // ref={elRef}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onClick={isPausable ? (pauseOnClick as any) : undefined}
        lottieRef={_lottieRef}
        loop={loop}
        autoplay={false}
        className={playerClass}
        animationData={animationData}
        rendererSettings={{className: 'Lottie-player_svg'}}
      />
    </>
  )
}
