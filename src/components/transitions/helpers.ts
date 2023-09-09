import type {CSSProperties} from 'preact/compat'

import type {CSSTransitionClassNames} from 'react-transition-group/CSSTransition'

import type {TransitionName} from './types'

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

/**
 *  Single transition helpers.
 */
export function buildProperties(
  name: TransitionName,
  styles?: CSSProperties,
  timeout?: number
) {
  return {
    styles: {
      ...styles,
      ...(timeout ? {animationDuration: `${timeout}ms`} : {}),
    } as CSSProperties,
    classNames: {
      appearActive: `transition-${name}_to`,
      enterActive: `transition-${name}_to`,
      exitActive: `transition-${name}_from`,
      appearDone: `transition-item_active`,
      enterDone: `transition-item_active`,
      exitDone: `transition-item_inactive`,
    } as CSSTransitionClassNames,
  }
}
