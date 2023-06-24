import { ComponentChildren } from 'preact'
import { FC, memo, useEffect, useState } from 'preact/compat'
import clsx from 'clsx'

import { CSSTransition } from 'lib/css-transition'

import './Transition.scss'

export type TransitionType =
  | 'zoomFade'
  | 'fade'
  | 'slide'
  | 'slideReverse'
  | 'slideFromRight'
  | 'slideFromLeft'
  | 'zoomSlide'
  | 'zoomSlideReverse'
  | 'custom'

interface TransitionProps {
  withMount: boolean
  isVisible: boolean
  duration?: number
  children?: ComponentChildren
  appear: boolean
  type: TransitionType
  className?: string
}
/* rewrite to constants */
const getTransitionDuration = (type: TransitionType) => {
  switch (type) {
    case 'fade':
    case 'slide':
      return 200
    case 'zoomFade':
      return 150
    default:
      return 400
  }
}
export const Transition: FC<TransitionProps> = memo(
  ({ withMount, isVisible, children, duration, appear, type, className }) => {
    const [isMounted, setIsMouted] = useState(isVisible)

    useEffect(() => {
      setIsMouted(isVisible)
    }, [isVisible])

    const transitionClassname = clsx(className && className, 'transition')
    return (
      <CSSTransition
        appear={appear}
        in={isMounted}
        duration={duration || getTransitionDuration(type)}
        classNames={type}
        alwaysMounted={!withMount}
      >
        <div class={transitionClassname}>{children}</div>
      </CSSTransition>
    )
  }
)
