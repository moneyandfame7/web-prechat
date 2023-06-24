/* eslint-disable no-console */
import { DeepSignal } from 'deepsignal'
import { FirebaseError } from 'firebase/app'
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth'

import type { SupportedLanguages } from 'types/lib'
import type { GlobalState, AuthState } from 'types/state'

import { throwFirebaseError, getFirebaseErrorMessage } from './errors'
import { authentication } from './config'

export function generateRecaptcha(state: GlobalState) {
  state.auth.captcha = new RecaptchaVerifier(
    'auth-recaptcha',
    {
      size: 'invisible',
      callback: (/* res:unknown */) => {
        /*  */
      }
    },
    authentication
  )
  return state.auth.captcha.render()
}

export async function sendCode(
  auth: DeepSignal<AuthState>,
  lang: SupportedLanguages,
  phone: string
) {
  authentication.languageCode = lang

  if (!auth.captcha) {
    console.warn('[AUTH] Captcha not defined')
    return
  }
  try {
    const res = await signInWithPhoneNumber(authentication, phone, auth.captcha)
    console.log({ res })

    auth.confirmResult = res
  } catch (err) {
    throwFirebaseError(auth, lang, err)
  }
}

export async function verifyCode(
  auth: DeepSignal<AuthState>,
  language: SupportedLanguages,
  code: string
) {
  try {
    auth.loading = true

    const response = await auth.confirmResult?.confirm(code)
    if (!response) {
      throw new FirebaseError(
        getFirebaseErrorMessage('auth/invalid-credential', language),
        'Response not found'
      )
    }
    console.log({ response })
    auth.loading = false
    return response
  } catch (err) {
    throwFirebaseError(auth, language, err)
  }
}
