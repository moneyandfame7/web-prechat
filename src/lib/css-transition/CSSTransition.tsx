import {type VNode, cloneElement} from 'preact'
import {memo} from 'preact/compat'

import Transition from './Transition'
import {computeClassName, joinClassNames} from './helpers'
import type {Phase, CSSTransitionProps, TransitionState} from './types'
/**
 * Taken from https://github.com/fakundo/preact-transitioning and modified
 */
export const CSSTransition = memo((props: CSSTransitionProps): VNode => {
  const {children, classNames, ...rest} = props

  const handler = (_state: TransitionState, phase: Phase) => {
    const {className} = children.props

    const finalClassName = joinClassNames(
      className,
      classNames,
      computeClassName(phase, classNames)
    )
    return cloneElement(children, {className: finalClassName})
  }
  return <Transition {...rest}>{handler}</Transition>
  // return createElement(
  //   Transition,
  //   /**
  //    * @todo пофіксити це? тут немає children, але він потрібен для створення..
  //    */
  //   // eslint-disable-next-line @typescript-eslint/no-explicit-any
  //   rest as any,
  //   (_state: TransitionState, phase: Phase) => {
  //     const {className} = children.props

  //     const finalClassName = joinClassNames(
  //       className,
  //       classNames,
  //       computeClassName(phase, classNames)
  //     )
  //     return cloneElement(children, {className: finalClassName})
  //   }
  // )
})
