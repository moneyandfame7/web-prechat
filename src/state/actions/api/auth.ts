/* eslint-disable no-console */
import * as firebase from 'lib/firebase'

import {updateGlobalState} from 'state/persist'
import {createAction} from 'state/action'
import {LANGUAGES_CODE_ARRAY} from 'state/helpers/settings'

import {AuthScreens} from 'types/state'
import type {SignUpInput} from 'types/api'
import type {SupportedLanguages} from 'types/lib'

import {USER_BROWSER, USER_PLATFORM} from 'common/config'
import {logDebugInfo, logDebugWarn} from 'lib/logger'
import {stringRemoveSpacing} from 'utilities/stringRemoveSpacing'
import {api} from 'api/client'
import {makeRequest} from 'api/request'
import {startTransition} from 'preact/compat'

/**
 * Get user connection info, country ( dial code, etc )
 */
createAction('getConnection', async (state) => {
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
    Boolean(state.auth.session)
  )
})

/**
 *  Check user on backend side
 */
createAction('sendPhone', async (state, _, payload) => {
  state.auth.loading = true
  logDebugWarn(`[AUTH]: Auth remember me: ${state.auth.rememberMe}`)
  const unformatted = stringRemoveSpacing(payload)

  const response = /* await callApi('sendPhone', unformatted) */ await api.auth.sendPhone(
    unformatted
  )
  const data = response?.data?.sendPhone

  console.log({data}, 'DATA???')
  /**
   * @todo Провірити цей case
   */
  if (!data) {
    state.auth.error = 'Auth send phone error'
    return
  }
  /* Check, if data.hasActiveSession ? send to app message, else firebase */
  await firebase.sendCode(state.auth, state.settings.i18n.lang_code, payload)
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
  if (!firebase_token) {
    console.error('[AUTH]: Code verification error')

    return
  }

  if (!firebase_token || state.auth.error) {
    console.error('[AUTH]: No token or auth error')
    return
  }
  const {data} = /* await callApi('getTwoFa', token) */ await api.twoFa.getTwoFa(
    firebase_token
  )
  if (data.getTwoFa) {
    updateGlobalState(
      {
        auth: {
          passwordHint: data.getTwoFa?.hint,
          email: data.getTwoFa?.email,
          screen: AuthScreens.Password
        }
      },
      false
    )
  } else if (state.auth.userId) {
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
          screen: AuthScreens.SignUp
        }
      },
      true
    )
  }
})

/**
 * Auth Sign In
 */
createAction('signIn', async (state, _, payload) => {
  state.auth.loading = true

  const {data} = /*  await callApi('signIn', payload) */ await api.auth.signIn(payload)

  if (!data?.signIn) {
    console.error('[AUTH]: «Sign in error»')
    return
  }
  logDebugWarn(`[AUTH]: Session: ${data.signIn.session}`)
  updateGlobalState(
    {
      auth: {
        session: data.signIn.session,
        loading: false
      }
    },
    state.auth.rememberMe
  )
})

/**
 * Auth Sign Up
 */
createAction('signUp', async (state, _, payload) => {
  const {silent, firstName, lastName, photo} = payload
  if (!state.auth.firebase_token || !state.auth.phoneNumber) {
    state.auth.error = 'Phone verification failed'
    console.error('[AUTH]: SIGN UP ERROR')

    return
  }

  const input: SignUpInput['input'] = {
    silent,
    firstName,
    lastName,
    phoneNumber: state.auth.phoneNumber,
    connection: {
      ...state.auth.connection!,
      browser: USER_BROWSER || 'Unknown',
      platform: USER_PLATFORM || 'Unknown'
    },
    firebase_token: state.auth.firebase_token
  }
  const {data} = /* await callApi('signUp', {input, photo}) */ await api.auth.signUp({
    input,
    photo
  })
  if (!data) {
    console.warn('[AUTH]: Sign Up error')
    return
  }
  console.log({data})

  updateGlobalState({
    auth: {
      session: data?.signUp.session
    }
  })
  /**
   * @todo Доробити тут
   */
})
