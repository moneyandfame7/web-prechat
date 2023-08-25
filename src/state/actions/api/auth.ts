import {ApolloError} from '@apollo/client'

import {Api} from 'api/manager'
import type {AuthSignInResponse, AuthSignUpInput} from 'api/types/auth'

import {createAction} from 'state/action'
import {LANGUAGES_CODE_ARRAY} from 'state/helpers/settings'
import {startPersist} from 'state/storages'
import {updateAuthState} from 'state/updates/auth'
import {updateSettingsState} from 'state/updates/settings'

/* eslint-disable no-console */
import * as firebase from 'lib/firebase'
import {logDebugWarn} from 'lib/logger'

import {USER_BROWSER, USER_PLATFORM} from 'common/config'
import {logger} from 'utilities/logger'
import {makeRequest} from 'utilities/makeRequest'
import {removeSession} from 'utilities/session'
import {unformatStr} from 'utilities/string/stringRemoveSpacing'

import type {ApiLangCode} from 'types/lib'
import {AuthScreens} from 'types/screens'

/**
 * Get user connection info, country ( dial code, etc )
 */
createAction('getConnection', async (state) => {
  const connection = await makeRequest('connection')

  const suggestedLanguage = connection.countryCode.toLowerCase() as ApiLangCode
  const existLanguage = LANGUAGES_CODE_ARRAY.find((code) => code === suggestedLanguage)

  updateAuthState(state, {
    connection,
  })
  updateSettingsState(state, {
    suggestedLanguage: existLanguage ? suggestedLanguage : 'en',
  })
})

createAction('authInit', async (state, actions) => {
  state.auth.isLoading = true

  if (!state.auth.connection) {
    await actions.getConnection()
  }

  await firebase.generateRecaptcha(state.auth)

  state.auth.isLoading = false
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

  // state.auth = {
  //   ...state.auth,
  //   screen: AuthScreens.Code,
  //   userId: response.userId,
  //   phoneNumber: payload,
  //   isLoading: false
  // }
  updateAuthState(state, {
    screen: AuthScreens.Code,
    userId: response.userId,
    phoneNumber: payload,
    isLoading: false,
  })
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
      firebase_token,
    })
  } else {
    updateAuthState(state, {
      firebase_token,
      screen: AuthScreens.SignUp,
      isLoading: false,
    })
    // state.auth = {
    //   ...state.auth,
    //   firebase_token,
    //   screen: AuthScreens.SignUp,
    //   isLoading: false,
    // }
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
        platform: USER_PLATFORM,
      },
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

  // updateAuthState(state, {
  //   isLoading: false,
  // })
  state.auth.isLoading = false
  updateAuthState(state, {
    session: response.sessionHash,
  })
  if (state.auth.rememberMe) {
    await startPersist()
  }
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
  const input: AuthSignUpInput['input'] = {
    silent,
    firstName,
    lastName,
    phoneNumber: unformatted,
    connection: {
      ...state.auth.connection!,
      browser: USER_BROWSER || 'Unknown',
      platform: USER_PLATFORM || 'Unknown',
    },
    firebase_token: state.auth.firebase_token,
  }
  const response = await Api.auth.signUp({input, photo})

  if (!response) {
    console.warn('[AUTH]: Sign Up error')
    return
  }

  updateAuthState(state, {
    isLoading: false,
    session: response.sessionHash,
  })

  if (state.auth.rememberMe) {
    await startPersist()
  }
})

createAction('signOut', async (_, actions) => {
  removeSession()

  await actions.reset()
})
