import {Signal} from '@preact/signals'
import type {SignalOr} from 'types/ui'

export const getLengthMaybeSignal = (value: SignalOr<string>) => {
  return value instanceof Signal ? value.value.length : value.length
}
