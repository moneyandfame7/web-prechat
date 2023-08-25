import type {ObjectOrValue} from 'types/common'

import type {TransitionCases, TransitionProperties} from './types'

export const FADE_IN_OUT: TransitionCases = {
  enter: {
    name: 'fade',
    duration: 350,
  },
  exit: {
    name: 'fade',
    duration: 350,
  },
}
export const ZOOM_FADE_IN_OUT: TransitionCases = {
  enter: {
    name: 'zoomFade',
    duration: 350,
  },
  exit: {
    name: 'zoomFade',
    duration: 350,
  },
}
export const SLIDE_FADE_IN: TransitionCases = {
  enter: {
    name: 'slide',
    duration: 300,
  },
  exit: {
    name: 'slideFade',
    duration: 300,
  },
}
export const SLIDE_FADE_OUT: TransitionCases = {
  enter: {
    name: 'slideFade',
    duration: 300,
  },
  exit: {
    name: 'slide',
    duration: 400,
  },
}
export const ZOOM_SLIDE_IN: TransitionCases = {
  enter: {
    name: 'slide',
    duration: 250,
  },
  exit: {
    name: 'zoomFade',
    duration: 250,
  },
}
export const ZOOM_SLIDE_OUT: TransitionCases = {
  enter: {
    name: 'zoomFade',
    duration: 250,
  },
  exit: {
    name: 'slide',
    duration: 250,
  },
}
export const SLIDE_IN: TransitionCases = {
  enter: {
    name: 'slide-200',
    duration: 400,
  },
  exit: {
    name: 'slide-200-backward',
    duration: 400,
  },
}
export const SLIDE_OUT: TransitionCases = {
  enter: {
    name: 'slide-200-backward',
    duration: 400,
  },
  exit: {
    name: 'slide-200',
    duration: 400,
  },
}
/* Switch Transition */
export function getTransitionProperty<TKey extends string | number>(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value: ObjectOrValue<TKey, any>,
  elementKey: TKey
) {
  if (typeof value === 'object') {
    return value[elementKey]
  }

  return value
}
export function getCleanupElements<TKey>(
  key: TKey,
  exception?: TKey[],
  shldCleanup?: boolean
) {
  const cleanupElements = exception?.find(el => el === key)

  return typeof cleanupElements !== 'undefined' ? Boolean(cleanupElements) : !shldCleanup
}

/* Transition.tsx */
export function buildCustomTransitionProperties(properties: TransitionProperties) {
  const {duration, name} = properties

  return {
    // eslint-disable-next-line prefer-template
    ...(duration ? {[`--transition-${name}-duration`]: duration + 'ms'} : {}),
  }
}

export function getTransitionDuration(duration: number) {
  const root = document.documentElement
  if (root?.classList.contains('animation-none')) {
    return 0
  } else if (root?.classList.contains('animation-level-2')) {
    /* робити перевірку, якщо це fade  */
    return 150
  }
  return duration
}
