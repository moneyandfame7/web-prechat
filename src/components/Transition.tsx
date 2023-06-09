import { ComponentChildren } from 'preact'
import { FC, memo, useEffect, useState } from 'preact/compat'

import { CSSTransition } from 'lib/css-transition'

interface TransitionProps {
  withMount: boolean
  isVisible: boolean
  duration: number
  children: ComponentChildren
  appear: boolean
  /**
   * @todo rewrite with type: "fade" | "scale" | "slide" | and maybe "other" and then use classname?
   */
  /* if willBeExit:zoom, if willBeEntered: fade, щось типу такого */
  className: string
}
export const Transition: FC<TransitionProps> = memo(
  ({ withMount, isVisible, children, duration, className, appear }) => {
    const [isMounted, setIsMouted] = useState(isVisible)

    useEffect(() => {
      setIsMouted(isVisible)
    }, [isVisible])

    return (
      <CSSTransition
        appear={appear}
        in={isMounted}
        duration={duration}
        classNames={className}
        alwaysMounted={!withMount}
      >
        <div
          className="YA CHMO"
          style={{ '--transition-duration': `${duration}ms`, height: '100%' }}
        >
          {children}
        </div>
      </CSSTransition>
    )
  }
)
