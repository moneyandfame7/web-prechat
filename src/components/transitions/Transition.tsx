import {type ComponentChildren, type VNode, cloneElement} from 'preact'
import {type FC, memo, useCallback, useRef} from 'preact/compat'

import {TransitionGroup} from 'react-transition-group'
import CSSTransition from 'react-transition-group/CSSTransition'

import {usePrevious} from 'hooks'

import {joinStrings} from 'utilities/string/joinStrings'

import {FALLBACK_TIMEOUT, TRANSITION_CLASSES, buildProperties} from './helpers'
import type {SingleTransitionProps, TransitionProps} from './types'

import './Transition.scss'

const Transition = <TKey extends number>({
  name,
  children,
  activeKey,
  shouldCleanup = false,
  cleanupException,
  direction = 'auto',
  containerClassname,
  timeout,
  innerClassnames,
}: TransitionProps<TKey>) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const prevActiveKey = usePrevious<any>(activeKey)
  // const forceUpdate = useForceUpdate()
  const elementsRef = useRef<Record<number, ComponentChildren>>({})
  const cleanup = useCallback(() => {
    if (!shouldCleanup) {
      return
    }

    const preservedRender =
      cleanupException !== undefined ? elementsRef.current[cleanupException] : undefined
    elementsRef.current = preservedRender ? {[cleanupException!]: preservedRender} : {}

    // forceUpdate()
  }, [activeKey, shouldCleanup, cleanupException])

  elementsRef.current[activeKey] = children
  const elementsKeys = Object.keys(elementsRef.current).map(Number)
  const isBackwards =
    direction === -1 ||
    (direction === 'auto' && prevActiveKey > activeKey) ||
    (direction === 'inverse' && prevActiveKey < activeKey)

  const elements = elementsKeys.map((key) => {
    const element = elementsRef.current[key]

    const className = innerClassnames
      ? typeof innerClassnames === 'object'
        ? innerClassnames[key as TKey]
        : innerClassnames
      : undefined

    return (
      <SingleTransition
        name="fade"
        className={className}
        key={key}
        transitionClassnames={TRANSITION_CLASSES}
        timeout={timeout}
      >
        {element}
      </SingleTransition>
    )
  })
  const buildedContainerClass = joinStrings(
    containerClassname,
    'transition',
    `transition-${name}${isBackwards ? 'Backwards' : ''}`
  )
  return (
    // @ts-expect-error Preact types are confused
    <TransitionGroup
      onAnimationEnd={cleanup}
      className={buildedContainerClass}
      childFactory={(c: VNode) => {
        /* react add to child component key prefix ".$" */
        return cloneElement(c, {
          in: c.key === activeKey,
          unmount: cleanupException !== undefined ? c.key !== cleanupException : shouldCleanup,
        } as Partial<SingleTransitionProps>)
      }}
    >
      {elements}
    </TransitionGroup>
  )
}

export default memo(Transition)

export const SingleTransition: FC<SingleTransitionProps> = memo(
  ({
    name,
    in: animateIn,
    unmount = true,
    appear,
    timeout,
    className,
    children,
    onClick,
    onEntered,
    onExited,
    transitionClassnames,
    elRef,
    key,
    styles,
  }) => {
    const {classNames, styles: buildedStyles} = buildProperties(name, styles, timeout)

    const buildedClassname = joinStrings(className, 'transition-item')
    return (
      // @ts-expect-error Preact types are confused
      <CSSTransition
        key={key}
        in={animateIn}
        appear={appear}
        unmountOnExit={unmount}
        mountOnEnter={true}
        timeout={timeout || FALLBACK_TIMEOUT}
        classNames={transitionClassnames || classNames}
        onExited={onExited}
        onEntered={onEntered}
      >
        {/*  @ts-expect-error Preact types are confused */}
        <div ref={elRef} className={buildedClassname} style={buildedStyles} onClick={onClick}>
          {children}
        </div>
      </CSSTransition>
    )
  }
)
