/* eslint-disable no-console */
import * as firebase from 'lib/firebase'

import {updateGlobalState} from 'state/persist'
import {createAction} from 'state/action'
import {LANGUAGES_CODE_ARRAY} from 'state/helpers/settings'

import type {SendPhoneResponse, SignUpInput} from 'types/api'
import type {SupportedLanguages} from 'types/lib'
import {AuthScreens} from 'types/screens'

import {USER_BROWSER, USER_PLATFORM} from 'common/config'
import {logDebugInfo, logDebugWarn} from 'lib/logger'
import {unformatStr} from 'utilities/stringRemoveSpacing'
import {Api} from 'api/client'
import {makeRequest} from 'api/request'
import {ApolloError} from '@apollo/client'

/**
 * Get user connection info, country ( dial code, etc )
 */
createAction('getConnection', async () => {
  const connection = await makeRequest('connection')

  const suggestedLanguage = connection.countryCode.toLowerCase() as SupportedLanguages
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
  state.auth.loading = true
  logDebugWarn(`[AUTH]: Auth remember me: ${state.auth.rememberMe}`)
  const unformatted = unformatStr(payload)
  let data: SendPhoneResponse | undefined
  try {
    const response = await Api.auth.sendPhone(unformatted)
    /* check error, return message */
    data = response?.data?.sendPhone
  } catch (e) {
    if (e instanceof ApolloError) {
      state.auth.error = (e.graphQLErrors[0] as any).code
      state.auth.loading = false
      return
    }
  }
  if (!data) {
    return
  }
  console.log(data?.userId, 'USER_ID')

  /* Check, if data.hasActiveSession ? send to app message, else firebase */
  const successfully = await firebase.sendCode(
    state.auth,
    state.settings.i18n.lang_code,
    payload
  )
  console.log({successfully})
  if (!successfully) {
    console.error(state.auth.error)
    return
  }
  logDebugInfo('[AUTH]: Code from firebase was sent')

  state.auth = {
    ...state.auth,
    screen: AuthScreens.Code,
    userId: data.userId,
    phoneNumber: payload,
    loading: false
  }
})

/**
 *  Verify code with Firebase
 */
createAction('verifyCode', async (state, actions, payload) => {
  state.auth.loading = true

  const firebase_token = await firebase.verifyCode(
    state.auth,
    state.settings.i18n.lang_code,
    payload
  )
  if (!firebase_token || state.auth.error) {
    console.error('[AUTH]: Code verification error')

    return
  }

  const {data} = await Api.twoFa.getTwoFa(firebase_token)
  /**
   * Check password, then try signIn with token, it return stage, or smth like
   * signUpRequired | passwordRequired | signInDone
   */
  if (data.getTwoFa) {
    updateGlobalState(
      {
        auth: {
          passwordHint: data.getTwoFa?.hint,
          email: data.getTwoFa?.email,
          screen: AuthScreens.Password,
          loading: false
        }
      },
      true
    )
  } else if (state.auth.userId) {
    // firebase.resetCaptcha(state.auth)
    actions.signIn({
      userId: state.auth.userId,
      firebase_token,
      connection: {
        ...state.auth.connection!,
        browser: USER_BROWSER,
        platform: USER_PLATFORM
      }
    })
  } else {
    updateGlobalState(
      {
        auth: {
          firebase_token,
          screen: AuthScreens.SignUp,
          loading: false
        }
      },
      false
    )
  }
})

/**
 * Auth Sign In
 */
createAction('signIn', async (state, _, payload) => {
  state.auth.loading = true

  const {data} = await Api.auth.signIn(payload)

  if (!data?.signIn) {
    console.error('[AUTH]: «Sign in error»')
    return
  }
  logDebugWarn(`[AUTH]: Session: ${data.signIn.session}`)

  /* FORCE UPDATE, for update all state ( i18n settings, auth and other)
    IF REMEMBER ME - TRUE */

  updateGlobalState(
    {
      auth: {
        session: data.signIn.session,
        loading: false
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
  state.auth.loading = true
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
  const {data} = await Api.auth.signUp({input, photo})

  if (!data) {
    console.warn('[AUTH]: Sign Up error')
    return
  }

  updateGlobalState(
    {
      auth: {
        session: data.signUp.session,
        loading: false
      }
    },
    state.auth.rememberMe,
    true
  )
})
