import {EMAIL_REGEXP} from './regexp'

export function isValidEmail(value: string) {
  return EMAIL_REGEXP.test(value)
}
