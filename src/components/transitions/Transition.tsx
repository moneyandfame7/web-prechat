import {type FC} from 'preact/compat'
import clsx from 'clsx'

import {CSSTransition} from 'lib/css-transition'

import type {TransitionProps} from './types'
import {buildCustomTransitionProperties, getTransitionDuration} from './helpers'

import './Transition.scss'
export const TransitionTest: FC<TransitionProps> = ({
  isMounted,
  name,
  duration = 0,
  elRef,
  styles,
  appear = false,
  alwaysMounted = false,
  children,
  className,
  onEndTransition,
  onStartTransition
}) => {
  const buildedStyles = buildCustomTransitionProperties({name, duration})

  const computedDuration = getTransitionDuration(duration)

  const buildedClassname = clsx('Transition', className)
  /**
   * /* МОЖЕ НЕ ПРАЦЮВАТИ, ЯКЩО ЗАДАВАТИ для children position absolute, ТІЛЬКИ У TRANSITION DIV.
   * ТРЕБА ЦЕ ПОФІКСИТИ.
   * ЯКЩО У TRANSITION діва немає ширини або висоти - він не анімується))))
   * або transitio div - position absolute, або children - absolute, або - ніхто не absolute, або треба вказувати ширину самому...
   */
  return (
    <CSSTransition
      appear={appear}
      in={isMounted}
      duration={computedDuration}
      classNames={name}
      alwaysMounted={alwaysMounted}
      onEntered={onEndTransition}
      onEnter={onStartTransition}
    >
      <div
        ref={elRef}
        style={{
          ...buildedStyles,
          ...styles
        }}
        class={buildedClassname}
      >
        {children}
      </div>
    </CSSTransition>
  )
}
