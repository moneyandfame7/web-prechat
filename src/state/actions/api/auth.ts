/* eslint-disable no-console */
import * as firebase from 'lib/firebase'

import {updateGlobalState} from 'state/persist'
import {createAction} from 'state/action'
import {LANGUAGES_CODE_ARRAY} from 'state/helpers/settings'

import type {SignUpInput} from 'types/api'
import type {ApiLangCode} from 'types/lib'
import {AuthScreens} from 'types/screens'

import {USER_BROWSER, USER_PLATFORM} from 'common/config'
import {logDebugWarn} from 'lib/logger'
import {unformatStr} from 'utilities/stringRemoveSpacing'
import {Api} from 'api/client'
import {makeRequest} from 'utilities/makeRequest'
import {logger} from 'utilities/logger'
import {ApolloError} from '@apollo/client'
import {AuthSignInResponse} from 'api/types/auth'
import {saveSession} from 'utilities/session'

/**
 * Get user connection info, country ( dial code, etc )
 */
createAction('getConnection', async () => {
  const connection = await makeRequest('connection')

  const suggestedLanguage = connection.countryCode.toLowerCase() as ApiLangCode
  const existLanguage = LANGUAGES_CODE_ARRAY.find((code) => code === suggestedLanguage)

  updateGlobalState(
    {
      auth: {
        connection
      },
      settings: {
        suggestedLanguage: existLanguage ? suggestedLanguage : 'en'
      }
    },
    false
  )
})

/**
 *  Check user on backend side
 */
createAction('sendPhone', async (state, _, payload) => {
  state.auth.isLoading = true
  logDebugWarn(`[AUTH]: Auth remember me: ${state.auth.rememberMe}`)
  const unformatted = unformatStr(payload)

  const response = await Api.auth.sendPhone(unformatted)
  /* check error, return message */
  if (!response) {
    console.error('AUTH RESPONSE ERROR')
    return
  }

  console.log(response?.userId, 'USER_ID')

  if (response.hasActiveSession) {
    /*  */
    logger.info('HAS ACTIVE SESSIONS!!! CODE FROM APP!!!')
  }
  const successfully = await firebase.sendCode(
    state.auth,
    state.settings.i18n.lang_code,
    payload
  )

  if (!successfully) {
    console.error(state.auth.error)
    return
  }

  logger.warn('Code from firebase was sent.')

  state.auth = {
    ...state.auth,
    screen: AuthScreens.Code,
    userId: response.userId,
    phoneNumber: payload,
    isLoading: false
  }
})

/**
 *  Verify code with Firebase
 */
createAction('verifyCode', async (state, actions, payload) => {
  state.auth.isLoading = true

  const firebase_token = await firebase.verifyCode(
    state.auth,
    state.settings.i18n.lang_code,
    payload
  )
  if (!firebase_token || state.auth.error) {
    console.error('[AUTH]: Code verification error')

    return
  }

  /**
   * Check password, then try signIn with token, it return stage, or smth like
   * signUpRequired | passwordRequired | signInDone
   */
  /*   if (data.getTwoFa) {
    updateGlobalState(
      {
        auth: {
          passwordHint: data.getTwoFa?.hint,
          email: data.getTwoFa?.email,
          screen: AuthScreens.Password,
          isLoading: false
        }
      },
      true
    )
  } else */ if (state.auth.userId) {
    // firebase.resetCaptcha(state.auth)
    actions.signIn({
      firebase_token
    })
  } else {
    state.auth = {
      ...state.auth,
      firebase_token,
      screen: AuthScreens.SignUp,
      isLoading: false
    }
  }
})

/**
 * Auth Sign In
 */
createAction('signIn', async (state, _, payload) => {
  state.auth.isLoading = true

  const {firebase_token} = payload
  let response: AuthSignInResponse | undefined
  try {
    response = await Api.auth.signIn({
      phoneNumber: unformatStr(state.auth.phoneNumber!),
      firebase_token,
      connection: {
        ...state.auth.connection!,
        browser: USER_BROWSER,
        platform: USER_PLATFORM
      }
    })
    if (!response) {
      return
    }
  } catch (e) {
    if (e instanceof ApolloError) {
      console.log(e, 'SIGN IN ERRROR!!!!')
    }
    return
  }

  if (!response) {
    console.error('[AUTH]: «Sign in error»')
    return
  }
  logDebugWarn(`[AUTH]: Session: ${response.sessionHash}`)

  /* FORCE UPDATE, for update all state ( i18n settings, auth and other)
    IF REMEMBER ME - TRUE */
  saveSession(response.sessionHash)

  updateGlobalState(
    {
      auth: {
        session: response.sessionHash,
        isLoading: false
      }
    },
    state.auth.rememberMe,
    true
  )
})

/**
 * Auth Sign Up
 */
createAction('signUp', async (state, _, payload) => {
  state.auth.isLoading = true

  const {silent, firstName, lastName, photo} = payload
  if (!state.auth.firebase_token || !state.auth.phoneNumber) {
    state.auth.error = 'Phone verification failed'
    console.error('[AUTH]: SIGN UP ERROR')

    return
  }

  const unformatted = unformatStr(state.auth.phoneNumber)
  const input: SignUpInput['input'] = {
    silent,
    firstName,
    lastName,
    phoneNumber: unformatted,
    connection: {
      ...state.auth.connection!,
      browser: USER_BROWSER || 'Unknown',
      platform: USER_PLATFORM || 'Unknown'
    },
    firebase_token: state.auth.firebase_token
  }
  const response = await Api.auth.signUp({input, photo})

  if (!response) {
    console.warn('[AUTH]: Sign Up error')
    return
  }
  saveSession(response.sessionHash)
  updateGlobalState(
    {
      auth: {
        session: response.sessionHash,
        isLoading: false
      }
    },
    state.auth.rememberMe,
    true
  )
})
