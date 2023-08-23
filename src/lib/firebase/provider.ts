import type {DeepSignal} from 'deepsignal'
/* eslint-disable no-console */

import {RecaptchaVerifier, signInWithPhoneNumber} from 'firebase/auth'
import {FirebaseError} from 'firebase/app'

import type {ApiLangCode} from 'types/lib'

import {authentication} from './config'
import {throwFirebaseError, getFirebaseErrorMessage} from './errors'
import type {TempAuthState} from 'managers/appAuthManager'
import type {AuthState} from 'store/auth.store'

export async function generateRecaptcha(auth: DeepSignal<AuthState>) {
  // if (auth.captcha) {
  //   await resetCaptcha(auth)
  //   return
  // }
  auth.captcha = new RecaptchaVerifier(
    'auth-recaptcha',
    {
      size: 'invisible'
      // callback: (res: unknown) => {
      //   /*  */
      // }
    },
    authentication
  )
  await auth.captcha.render()
}

export async function sendCode(
  auth: DeepSignal<AuthState>,
  lang: ApiLangCode,
  phone: string
) {
  authentication.languageCode = lang

  if (!auth.captcha) {
    console.warn('[AUTH] Captcha not defined')
    return false
  }
  try {
    const res = await signInWithPhoneNumber(authentication, phone, auth.captcha)
    auth.confirmResult = res
    return true
  } catch (err) {
    throwFirebaseError(auth, lang, err)
    return false
  }
}

export async function verifyCode(
  auth: DeepSignal<AuthState>,
  language: ApiLangCode,
  code: string
) {
  try {
    const credentials = await auth.confirmResult?.confirm(code)
    if (!credentials) {
      throw new FirebaseError(
        getFirebaseErrorMessage('auth/invalid-credential', language),
        'Response not found'
      )
    }
    return credentials?.user.getIdToken()
  } catch (err) {
    throwFirebaseError(auth, language, err)
  }
}

export async function resetCaptcha(auth: DeepSignal<TempAuthState>) {
  if (auth.captcha) {
    auth.captcha.clear()
    const captchaWrapper = document.getElementById('auth-recaptcha-wrapper')
    if (captchaWrapper) {
      captchaWrapper.innerHTML = `<div id="auth-recaptcha" />`
    }
  }
}
