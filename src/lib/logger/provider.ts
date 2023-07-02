/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
import { DEBUG } from 'common/config'

export function logDebugError(...error: any[]) {
  if (DEBUG) {
    console.error(...error)
  }
}

export function logDebugWarn(...warn: any[]) {
  if (DEBUG) {
    console.warn(...warn)
  }
}

export function logDebugInfo(...info: any[]) {
  if (DEBUG) {
    console.log(...info)
  }
}
