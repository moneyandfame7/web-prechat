import {type ComponentChildren, type VNode, cloneElement} from 'preact'
import {type FC, memo, useCallback, useRef} from 'preact/compat'

import clsx from 'clsx'
import {TransitionGroup} from 'react-transition-group'
import CSSTransition from 'react-transition-group/CSSTransition'

import {usePrevious} from 'hooks'

import {joinStrings} from 'utilities/string/joinStrings'

import {TRANSITION_CLASSES, buildProperties, getTransitionTimeout} from './helpers'
import type {SingleTransitionProps, TransitionProps} from './types'

import './Transition.scss'

/**
 * АБО ТРЕБА ДИВИТИСЬ ПЕРЕРОБЛЮВАТИ З НУЛЯ, АБО ЧЕКНУТИ АНІМАЦІЇ, АБО ХЗ ЩО ЩЕ СУКА РОБИТИ
 */
const Transition = <TKey extends number | string>({
  name,
  appear,
  children,
  activeKey,
  shouldCleanup = false,
  cleanupException,
  cleanupElements,
  direction = 'auto',
  containerClassname,
  timeout,
  innerClassnames,
  shouldLockUI = name === 'zoomSlide' || name === 'slideDark',
  isLayout = name === 'zoomSlide' || name === 'slideDark',
  elRef,
  additionalChildren,
  innerAttributes,
}: TransitionProps<TKey>) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const prevActiveKey = usePrevious<any>(activeKey)
  // const forceUpdate = useForceUpdate()
  const elementsRef = useRef<Record<string | number, ComponentChildren>>({})
  const containerRef = useRef<{base: HTMLDivElement}>(null)
  // const container = containerRef.current?.base
  // const childs = Array.from(container?.childNodes || [])
  const isAnimated = useRef(false)

  // console.log({container, childs})
  const cleanup = useCallback(() => {
    if (!shouldCleanup) {
      return
    }
    const preservedRender =
      cleanupException !== undefined ? elementsRef.current[cleanupException] : undefined

    elementsRef.current = preservedRender ? {[cleanupException!]: preservedRender} : {}

    // forceUpdate()
  }, [activeKey, shouldCleanup, cleanupException, cleanupElements])

  elementsRef.current[activeKey] = children
  const elementsKeys = Object.keys(elementsRef.current).map((k) =>
    typeof activeKey === 'string' ? String(k) : Number(k)
  )
  const isBackwards =
    direction === -1 ||
    (direction === 'auto' && prevActiveKey > activeKey) ||
    (direction === 'inverse' && prevActiveKey < activeKey)

  const elements = elementsKeys.map((key) => {
    const element = elementsRef.current[key]

    // eslint-disable-next-line no-nested-ternary
    const className = innerClassnames
      ? typeof innerClassnames === 'object'
        ? innerClassnames?.[key as TKey]
        : innerClassnames
      : undefined
    const attributes = innerAttributes?.[key as TKey]
    return (
      <SingleTransition
        appear={appear}
        name="zoomFade"
        className={className}
        key={key}
        transitionClassnames={TRANSITION_CLASSES}
        timeout={timeout}
        divAttributes={attributes}
      >
        {element}
      </SingleTransition>
    )
  })
  const buildedContainerClass = joinStrings(
    containerClassname,
    'transition',
    `transition_${isLayout ? 'layout' : ''}`,
    `transition-${name}${isBackwards ? 'Backwards' : ''}`
  )

  // console.log(isAnimated.current, 'IS_ANIMATED?')
  // console.log({prevActiveKey, activeKey})
  return (
    // @ts-expect-error Preact types are confused
    <TransitionGroup
      // ref={containerRef}
      className={buildedContainerClass}
      /* react add to child component key prefix ".$" */
      childFactory={(c: VNode) =>
        cloneElement(c, {
          in: c.key === activeKey,
          unmount: cleanupException !== undefined ? c.key !== cleanupException : shouldCleanup,
          onExited: () => {
            cleanup()
            // isAnimated.current = false
            isAnimated.current = false
          },
          onEnter: () => {
            isAnimated.current = true
          },
          shouldLockUI,
        } as Partial<SingleTransitionProps>)
      }
    >
      {elements}
      {additionalChildren}
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
    onEnter,
    transitionClassnames,
    elRef,
    direction,
    key,
    styles,
    shouldSkip,
    shouldLockUI,
    toggle,
    onMouseLeave,
    onMouseEnter,
    visibilityHidden,
    easing,
    divAttributes,
    // onMouseDown,
  }) => {
    const {classNames, styles: buildedStyles} = buildProperties(
      name,
      styles,
      timeout,
      direction,
      toggle,
      animateIn,
      visibilityHidden,
      easing
    )

    const buildedClassname = clsx(className, 'transition-item', {
      'transition-item_ui-lock': shouldLockUI,
    })
    return (
      // @ts-expect-error Preact types are confused
      <CSSTransition
        key={key}
        in={shouldSkip || animateIn}
        appear={appear}
        unmountOnExit={unmount}
        mountOnEnter={true}
        timeout={getTransitionTimeout(name, timeout)}
        classNames={transitionClassnames || classNames}
        onExited={onExited}
        onEntered={onEntered}
        onEnter={onEnter}
      >
        {/*  @ts-expect-error Preact types are confused */}
        <div
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          ref={elRef}
          className={buildedClassname}
          style={buildedStyles}
          onClick={onClick}
          {...divAttributes}
          // onMouseDown={onMouseDown}
        >
          {children}
        </div>
      </CSSTransition>
    )
  }
)
