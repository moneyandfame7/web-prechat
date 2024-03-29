import type {CSSProperties} from 'preact/compat'

import type {CSSTransitionClassNames} from 'react-transition-group/CSSTransition'

import type {TransitionDirection, TransitionEasing, TransitionName} from './types'

export const TRANSITION_CLASSES = {
  /* Appear - first mount. */
  appearActive: 'transition-item_to',
  appearDone: 'transition-item_active',
  enterDone: 'transition-item_active',
  enterActive: 'transition-item_to',
  exitActive: 'transition-item_from',
  exitDone: 'transition-item_inactive',
} as CSSTransitionClassNames
export const FALLBACK_TIMEOUT = 350

export function getTransitionTimeout(name: TransitionName, timeout?: number) {
  if (name === 'fade') {
    return timeout ?? FALLBACK_TIMEOUT
  }
  if (document.documentElement.classList.contains('animation-none')) {
    return 0
  }
  if (timeout !== undefined) {
    return timeout
  }

  switch (name) {
    case 'zoomSlide':
      return 250
    default:
      return FALLBACK_TIMEOUT
  }
}
export function getTransitionName(name: TransitionName, timeout?: number) {
  // if (document.documentElement.classList.contains('animation-none')) {
  //  if(name==='')
  // }
}

/**
 *  Single transition helpers.
 */
export function buildProperties(
  name: TransitionName,
  styles?: CSSProperties,
  timeout?: number,
  direction?: TransitionDirection,
  toggle?: boolean,
  animateIn?: boolean,
  visibilityHidden?: boolean,
  easing?: TransitionEasing
) {
  const isBackwards = direction === -1 || direction === 'inverse'
  // eslint-disable-next-line no-nested-ternary
  const shouldToggle = toggle ? (isBackwards ? animateIn : !animateIn) : isBackwards

  const computedName = `${name}${shouldToggle ? 'Backwards' : ''}`

  return {
    styles: {
      ...styles,
      ...(timeout !== undefined && {animationDuration: `${timeout}ms`}),
      ...(easing && {animationTimingFunction: easing}),
    } as CSSProperties,
    classNames: {
      appearActive: `transition-${computedName}_to`,
      enterActive: `transition-${computedName}_to`,
      exitActive: `transition-${computedName}_from`,
      appearDone: `transition-item_active`,
      enterDone: `transition-item_active`,
      exitDone: visibilityHidden ? 'transition-item_hide' : `transition-item_inactive`,
    } as CSSTransitionClassNames,
  }
}
