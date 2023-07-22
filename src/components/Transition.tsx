import type {ComponentChildren, JSX, RefObject} from 'preact'
import {type FC, memo, useEffect, useState, useMemo} from 'preact/compat'
import clsx from 'clsx'

import {CSSTransition} from 'lib/css-transition'
import {
  TRANSITION_DURATION_FADE,
  TRANSITION_DURATION_SLIDE,
  TRANSITION_DURATION_ZOOM_FADE
} from 'common/config'

import './Transition.scss'

export type TransitionType =
  | 'zoomFade'
  | 'fade'
  | 'slide'
  | 'zoomSlide'
  | 'zoomSlideReverse'

// export type ComposedTransitionType = 'zoomSlide' | 'zoomSlideReverse'

// export type AllTransitionType = TransitionType & ComposedTransitionType
interface TransitionProps {
  elRef?: RefObject<HTMLDivElement>
  withMount: boolean
  isVisible: boolean
  duration?: number
  children?: ComponentChildren
  appear: boolean
  type: 'zoomFade' | 'fade' | 'slide'
  className?: string
  styles?: JSX.CSSProperties
  absoluted?: boolean
  full?: boolean
}
/* rewrite to constants */
const getTransitionDuration = (type: TransitionType) => {
  const root = document.documentElement
  if (root?.classList.contains('animation-none')) {
    return 0
  } else if (root?.classList.contains('animation-level-2')) {
    return 150
  }
  switch (type) {
    /* if animation none - return 0? , if level 2 - 150?? or also 0*/
    case 'slide':
      return TRANSITION_DURATION_SLIDE
    case 'fade':
      return TRANSITION_DURATION_FADE
    case 'zoomFade':
      return TRANSITION_DURATION_ZOOM_FADE
    default:
      return 300
  }
}
const cssTransitionNames: Pick<
  Record<TransitionType, string>,
  'fade' | 'slide' | 'zoomFade'
> = {
  'fade': '--transition-duration-fade',
  'slide': '--transition-duration-slide',
  'zoomFade': '--transition-duration-zoom-fade'
}
export const Transition: FC<TransitionProps> = memo(
  ({
    withMount,
    isVisible,
    children,
    duration,
    appear,
    type,
    className,
    elRef,
    styles,
    absoluted = true,
    full = true
  }) => {
    const [isMounted, setIsMouted] = useState(isVisible)

    useEffect(() => {
      setIsMouted(isVisible)
    }, [isVisible])

    const transitionClassname = clsx(className, 'Transition', {
      'Transition_absoluted': absoluted,
      'Transition_full': full
    })

    const buildedStyles = useMemo(
      () => ({
        ...(duration ? {[cssTransitionNames[type] as string]: `${duration}ms`} : {}),
        ...styles
      }),
      [duration, type, styles]
    )

    return (
      <CSSTransition
        appear={appear}
        in={isMounted}
        duration={duration || getTransitionDuration(type)}
        classNames={type}
        alwaysMounted={!withMount}
      >
        <div ref={elRef} class={transitionClassname} style={buildedStyles}>
          {children}
        </div>
      </CSSTransition>
    )
  }
)
