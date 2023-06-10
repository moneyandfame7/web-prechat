import { ComponentChildren } from 'preact'
import { FC, memo, useEffect, useState } from 'preact/compat'

import { CSSTransition } from 'lib/css-transition'

import './Transition.scss'

export type TransitionType =
  | 'zoomFade'
  | 'fade'
  | 'slide'
  | 'zoomSlide'
  | 'zoomSlideReverse'
  | 'custom'
  | 'slide'

interface TransitionProps {
  withMount: boolean
  isVisible: boolean
  duration?: number
  children: ComponentChildren
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
  ({ withMount, isVisible, children, duration, appear, type }) => {
    const [isMounted, setIsMouted] = useState(isVisible)

    useEffect(() => {
      setIsMouted(isVisible)
    }, [isVisible])

    return (
      <CSSTransition
        appear={appear}
        in={isMounted}
        duration={duration || getTransitionDuration(type)}
        classNames={type}
        alwaysMounted={!withMount}
      >
        <div class="transition">{children}</div>
      </CSSTransition>
    )
  }
)
