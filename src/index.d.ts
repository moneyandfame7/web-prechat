import { ConfirmationResult, RecaptchaVerifier } from 'firebase/auth'

export {}
declare global {
  interface Window {
    recaptchaVerifier: RecaptchaVerifier
    recaptchaVerifierId: number
    confirmResult: ConfirmationResult
  }
}
