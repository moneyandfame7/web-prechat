import { Platform } from 'types/api'

const { userAgent, platform } = window.navigator

function detectPlatform(): Platform | undefined {
  const macosPlatforms = ['Macintosh', 'MacIntel', 'MacPPC', 'Mac68K']
  const windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE']
  const iosPlatforms = ['iPhone', 'iPad', 'iPod']

  if (
    iosPlatforms.indexOf(platform) !== -1 ||
    // For new IPads with M1 chip and IPadOS platform returns "MacIntel"
    (platform === 'MacIntel' && 'maxTouchPoints' in navigator && navigator.maxTouchPoints > 2)
  ) {
    return 'iOS'
  } else if (macosPlatforms.indexOf(platform) !== -1) {
    return 'macOS'
  } else if (windowsPlatforms.indexOf(platform) !== -1) {
    return 'Windows'
  } else if (/Android/.test(userAgent)) {
    return 'Android'
  } else if (/Linux/.test(platform)) {
    return 'Linux'
  }
}
function detectBrowser(): string | undefined {
  if ((window as any)?.opr?.addons || (window as any)?.opera || userAgent.indexOf(' OPR/') >= 0) {
    return `Opera ${userAgent.substring(userAgent.indexOf('OPR/') + 4)}`
  } else if (userAgent.indexOf('Edge') >= 0) {
    return `Microsoft Edge ${userAgent.substring(userAgent.indexOf('Edge/') + 5)}`
  } else if (userAgent.indexOf('Chrome') >= 0) {
    return `Google Chrome ${userAgent.substring(userAgent.indexOf('Chrome/') + 7)}`
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

export const USER_PLATFORM: Platform = detectPlatform() || 'Unknown'
export const USER_BROWSER: string = detectBrowser() || 'Unknown'

export const SUGGESTED_LANGUAGE = window.navigator.language
export const IS_SENSOR = window.matchMedia('(pointer: coarse)').matches

export const AUTH_CAPTCHA_EL = 'auth_captcha_el'
export const AUTH_CAPTCHA_CONTAINER = 'auth_captcha_container'
export const DEBUG = import.meta.env.DEV

export const TRANSITION_DURATION_FADE = 200
export const TRANSITION_DURATION_SLIDE = 200
export const TRANSITION_DURATION_ZOOM_FADE = 150
