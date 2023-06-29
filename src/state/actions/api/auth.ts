/* eslint-disable no-console */
import * as firebase from 'lib/firebase'

import { callApi } from 'api/provider'

import { AuthScreens } from 'types/state'
import type { SignUpInput } from 'types/api'
import type { SupportedLanguages } from 'types/lib'

import { createAction } from 'state/action'
import { LANGUAGES_CODE_ARRAY } from 'state/helpers/settings'

import { USER_BROWSER, USER_PLATFORM } from 'common/config'
import { updateGlobalState } from 'state/persist'

createAction('getConnection', async () => {
  const connection = await callApi('fetchConnection')

  const suggestedLanguage = connection.countryCode.toLowerCase() as SupportedLanguages
  const existLanguage = LANGUAGES_CODE_ARRAY.find((code) => code === suggestedLanguage)

  updateGlobalState({
    auth: {
      connection
    },
    settings: {
      suggestedLanguage: existLanguage ? suggestedLanguage : 'en'
    }
  })
})

createAction('sendPhone', async (state, payload) => {
  state.auth.loading = true
  const response = await callApi('sendPhone', payload)
  if (!response || !response.data?.sendPhone) {
    state.auth.error = 'Auth send phone error'
    return
  }
  const data = response.data.sendPhone

  await firebase.sendCode(state.auth, state.settings.i18n.lang_code, payload)
  console.log('[AUTH]: Code from firebase was sent')

  console.log('[AUTH]: Remember me:', state.auth.rememberMe)

  updateGlobalState(
    {
      auth: {
        userId: data.userId,
        phoneNumber: payload,
        loading: false,
        screen: AuthScreens.Code
      }
    },
    false
  )
})

createAction('verifyCode', async (state, payload) => {
  state.auth.loading = true
  const credentials = await firebase.verifyCode(state.auth, state.settings.i18n.lang_code, payload)
  if (!credentials) {
    return
  }
  const token = await credentials?.user.getIdToken()
  if (!token || state.auth.error) {
    console.warn('[AUTH]: No token or auth error')
    return
  }
  const { data } = await callApi('getTwoFa', token)
  if (!state.auth.userId) {
    updateGlobalState(
      {
        auth: {
          token,
          screen: AuthScreens.SignUp
        }
      },
      false
    )
    return
  } else if (data.getTwoFa) {
    updateGlobalState(
      {
        auth: {
          passwordHint: data.getTwoFa.hint,
          email: data.getTwoFa.email,
          screen: AuthScreens.Password
        }
      },
      false
    )
    return
  } else {
    const { data } = await callApi('signIn', {
      userId: state.auth.userId,
      token,
      connection: {
        ...state.auth.connection!,
        browser: USER_BROWSER,
        platform: USER_PLATFORM
      }
    })
    if (!data?.signIn) {
      console.warn('[AUTH]: Sign In error')
      return
    }
    updateGlobalState(
      {
        auth: {
          session: data.signIn.session,
          loading: false
        }
      },
      state.auth.rememberMe
    )
  }
})

createAction('signUp', async (state, payload) => {
  const { silent, firstName, lastName, photo } = payload
  if (!state.auth.token || !state.auth.phoneNumber) {
    state.auth.error = 'Phone verification failed'
    console.warn('[AUTH]: SIGN UP ERROR')

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
    token: state.auth.token
  }
  const { data } = await callApi('signUp', { input, photo })
  if (!data) {
    console.warn('[AUTH]: Sign Up error')
    return
  }
  console.log({ data })

  updateGlobalState({
    auth: {
      session: data?.signUp.session
    }
  })
  /* доробити це */
})
