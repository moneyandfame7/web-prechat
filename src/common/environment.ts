/* eslint-disable @typescript-eslint/no-explicit-any */
import type {TransitionName} from 'components/transitions'

/*
 * API
 */

export const API_AVATAR_VARIANTS = [
  'GREEN',
  'PINK',
  'BLUE',
  'YELLOW',
  'PURPLE',
  'ORANGE',
] as const

export const USE_USERNAMES = true

/* UI  */
const {userAgent, platform} = window.navigator

function detectPlatform(): string | undefined {
  const macosPlatforms = ['Macintosh', 'MacIntel', 'MacPPC', 'Mac68K']
  const windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE']
  const iosPlatforms = ['iPhone', 'iPad', 'iPod']
  /*  */
  const androidMatch = userAgent.match(/android\s([0-9.]*)/i)
  if (
    iosPlatforms.indexOf(platform) !== -1 ||
    (platform === 'MacIntel' && 'maxTouchPoints' in navigator && navigator.maxTouchPoints > 2)
  ) {
    return 'iOS'
  } else if (macosPlatforms.indexOf(platform) !== -1) {
    return 'macOS'
  } else if (windowsPlatforms.indexOf(platform) !== -1) {
    const windowsVersion = window.navigator.appVersion.split('NT')[1].split(';')[0].trim()
    return `Windows ${windowsVersion}`
  } else if (androidMatch) {
    return `Android${androidMatch ? `${androidMatch[1]}` : ''}`
  } else if (/Linux/.test(platform)) {
    return 'Linux'
  }
}
function detectBrowser(): string | undefined {
  if (userAgent.indexOf('Vivaldi') !== -1) {
    return 'Vivaldi'
  } else if (userAgent.indexOf('Brave') !== -1) {
    return 'Brave'
  } else if (userAgent.match(/SamsungBrowser/i)) {
    return 'Samsung Browser'
  } else if (
    (window as any)?.opr?.addons ||
    (window as any)?.opera ||
    userAgent.indexOf(' OPR/') >= 0
  ) {
    return `Opera ${userAgent.substring(userAgent.indexOf('OPR/') + 4)}`
  } else if (userAgent.indexOf('Edge') >= 0) {
    return `Microsoft Edge ${userAgent.substring(userAgent.indexOf('Edge/') + 5)}`
  } else if (userAgent.indexOf('Chrome') >= 0) {
    return `Google Chrome ${userAgent.split('Chrome/')[1].split(' ')[0]}`
  } else if (userAgent.indexOf('Safari') >= 0) {
    return `Safari ${userAgent.substring(userAgent.indexOf('Version/') + 8)}`
  } else if (userAgent.indexOf('Firefox') >= 0) {
    return `Mozilla Firefox ${userAgent.substring(userAgent.indexOf('Firefox/') + 8)}`
  } else if (userAgent.indexOf('MSIE') >= 0 || userAgent.indexOf('Trident/') >= 0) {
    const browserVersion: string | number = userAgent.substring(
      userAgent.indexOf('MSIE') + 5,
      userAgent.indexOf(';')
    )
    if (parseInt(browserVersion) === -1) {
      return `Microsoft Internet Explorer ${userAgent.substring(userAgent.indexOf('rv:') + 3)}`
    }
    return `Microsoft Internet Explorer ${browserVersion}`
  }
}

export const USER_PLATFORM = detectPlatform() || 'Unknown'
export const USER_BROWSER: string = detectBrowser() || 'Unknown'
export const IS_APPLE = USER_PLATFORM === 'iOS' || USER_PLATFORM === 'macOS'
export const IS_SAFARI = USER_BROWSER.startsWith('Safari')
export const SUGGESTED_LANGUAGE = window.navigator.language
export const IS_SENSOR = window.matchMedia('(pointer: coarse)').matches
export const IS_SMALL_SCREEN = window.matchMedia('(max-width: 768px)').matches
export const AUTH_CAPTCHA_EL = 'auth_captcha_el'
export const AUTH_CAPTCHA_CONTAINER = 'auth_captcha_container'
export const DEBUG = import.meta.env.DEV || import.meta.env.NODE_ENV === 'staging'
/* || ?debug=1 */
export const USE_APPLE_EMOJI = true

export const IS_EMOJI_SUPPORTED = IS_APPLE && USE_APPLE_EMOJI
export const GITHUB_SOURCE = 'https://github.com/moneyandfame7/web-prechat#readme'

export const APP_TRANSITION_NAME = (
  IS_SMALL_SCREEN ? 'slideDark' : 'zoomSlide'
) satisfies TransitionName
export const TRANSITION_DURATION_ZOOM_FADE = 200
export const TRANSITION_DURATION_MENU = 200 /* 150 */

export const NOTIFICATION_TRANSITION = 300
export const MODAL_TRANSITION_MS = 300

export const FONT_PX = 16
export const INPUT_HELPER_HEIGHT = 45
