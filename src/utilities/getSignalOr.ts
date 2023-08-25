import {Signal} from '@preact/signals'

import type {SignalOr} from 'types/ui'

export function getSignalOr<T>(maybeSignal: SignalOr<T>): T {
  if (maybeSignal instanceof Signal) {
    return maybeSignal.value
  }

  return maybeSignal
}
