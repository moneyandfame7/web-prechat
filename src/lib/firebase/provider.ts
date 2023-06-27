import { DeepSignal } from 'deepsignal'
/* eslint-disable no-console */

import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth'
import { FirebaseError } from 'firebase/app'

import type { SupportedLanguages } from 'types/lib'
import type { AuthState } from 'types/state'

import { authentication } from './config'
import { throwFirebaseError, getFirebaseErrorMessage } from './errors'

export async function generateRecaptcha(auth: DeepSignal<AuthState>) {
  if (auth.captcha) {
    await resetCaptcha(auth)
    return
  }
  auth.captcha = new RecaptchaVerifier(
    'auth-recaptcha',
    {
      size: 'invisible',
      callback: (/* res:unknown */) => {
        /*  */
      }
    },
    authentication
  )
  auth.captcha.render()
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
    console.log(response)
    if (!response) {
      throw new FirebaseError(
        getFirebaseErrorMessage('auth/invalid-credential', language),
        'Response not found'
      )
    }
    auth.loading = false
    return response
  } catch (err) {
    console.log(err)
    throwFirebaseError(auth, language, err)
  }
}

export async function resetCaptcha(auth: DeepSignal<AuthState>) {
  if (auth.captcha) {
    auth.captcha.clear()
    const captchaWrapper = document.getElementById('auth-recaptcha-wrapper')
    if (captchaWrapper) {
      captchaWrapper.innerHTML = `<div id="auth-recaptcha" />`
    }
  }
}
