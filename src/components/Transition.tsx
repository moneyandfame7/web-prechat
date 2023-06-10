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
  | ''

interface TransitionProps {
  withMount: boolean
  isVisible: boolean
  duration?: number
  children: ComponentChildren
  appear: boolean
  /**
   * @todo rewrite with type: "fade" | "scale" | "slide" | and maybe "other" and then use classname?
   */
  /* if willBeExit:zoom, if willBeEntered: fade, щось типу такого */
  type: TransitionType
  className?: string
}
/* rewrite to constants */
const getTransitionDuration = (type: TransitionType) => {
  switch (type) {
    case 'fade':
      return 150
    case 'zoomFade':
      return 150
    case 'slide':
      return 200
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
