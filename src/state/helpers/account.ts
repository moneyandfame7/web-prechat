import type {ApiSession} from 'api/types'

import {formatDate} from 'utilities/date/convert'
import {milliseconds} from 'utilities/date/ms'

/**
 *  SESSIONS
 */

/**
 *
 * @params
 */
export function getSessionStatus(session: ApiSession, isFull = true) {
  if (session.isCurrent) {
    return undefined
  }

  const now = Date.now()
  const activeAt = new Date(session.activeAt)

  if (now - activeAt.getTime() < milliseconds({minutes: 1})) {
    return 'online'
  }

  return formatDate(activeAt, true, isFull)
}

export function getSessionLocation(session: ApiSession) {
  return [session.region, session.country].filter(Boolean).join(', ')
}

export function getSessionIcon(session: ApiSession) {
  if (session.browser.includes('Vivaldi')) {
    return 'vivaldi'
  } else if (session.browser.includes('Chrome')) {
    return 'chrome'
  } else if (session.browser.includes('Samsung')) {
    return 'samsung'
  } else if (session.browser.includes('Opera')) {
    return 'opera'
  } else if (session.browser.includes('Safari')) {
    return 'safari'
  } else if (session.browser.includes('Firefox')) {
    return 'firefox'
  } else if (session.browser.includes('Brave')) {
    return 'brave'
  } else if (session.browser.includes('Edge')) {
    return 'edge'
  } else if (session.platform.includes('macOS')) {
    return 'mac'
  } else if (session.platform.includes('iOS')) {
    return 'ios'
  } else if (session.platform.includes('xbox')) {
    return 'xbox'
  } else if (session.platform.includes('Linux')) {
    return 'linux'
  } else if (session.platform.includes('Windows')) {
    return 'windows'
  } else if (session.platform.includes('Android')) {
    return 'android'
  }

  return 'unknown'
}
export const ANIMATED_SESSION_ICONS = ['chrome', 'safari', 'firefox', 'edge'] as const
export type SessionIcon = ReturnType<typeof getSessionIcon>

export type AnimatedSessionIcon = (typeof ANIMATED_SESSION_ICONS)[number]

export function isAnimatedSessionIcon(icon: SessionIcon): icon is AnimatedSessionIcon {
  return ANIMATED_SESSION_ICONS.includes(icon as AnimatedSessionIcon)
}
