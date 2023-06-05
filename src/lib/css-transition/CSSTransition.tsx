import { VNode, cloneElement, createElement } from 'preact'
import { memo } from 'preact/compat'

import Transition from './Transition'
import { computeClassName, joinClassNames } from './helpers'
import { type CSSTransitionProps, Phase, type TransitionState } from './types'

export const CSSTransition = memo((props: CSSTransitionProps): VNode => {
  const { children, classNames, ...rest } = props

  return createElement(
    Transition,
    /**
     * @todo пофіксити це? тут немає children, але він потрібен для створення..
     */
    rest as any,
    (_state: TransitionState, phase: Phase) => {
      const { className } = children.props

      const finalClassName = joinClassNames(
        className,
        classNames,
        computeClassName(phase, classNames)
      )

      // console.log({ className, finalClassName })
      return cloneElement(children, { className: finalClassName })
    }
  )
})
