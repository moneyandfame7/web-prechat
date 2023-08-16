import {DEBUG} from 'common/config'

export const REG_PHONE = /^\+\d{1,4}\s?\d{10,}$/

export const validatePhone = (phone: string) => {
  const matched = REG_PHONE.test(phone)
  if (DEBUG) {
    return matched || phone === '+12345678'
  }

  return matched
}
