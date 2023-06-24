/* eslint-disable no-console */
import { batch } from '@preact/signals'

import * as firebase from 'lib/firebase'
import { callApi } from 'api/provider'
import { AuthScreens } from 'types/state'
import type { Country, SignUpInput } from 'types/api'
import type { SupportedLanguages } from 'types/lib'

import { createAction } from 'state/action'
import { LANGUAGES_CODE_ARRAY } from 'state/helpers/settings'

import { omit } from 'common/functions'
import { USER_BROWSER, USER_PLATFORM } from 'common/config'

createAction('getCountries', async (state, payload) => {
  const { countries } = await callApi('fetchCountries', payload)
  if (!countries.length) return

  const withoutTypename = countries.map((country) => omit(country, '__typename' as any))
  state.countryList = withoutTypename as Country[]
})

createAction('getConnection', async (state) => {
  const connection = await callApi('fetchConnection')
  const suggestedLanguage = connection.countryCode.toLowerCase() as SupportedLanguages
  const existLanguage = LANGUAGES_CODE_ARRAY.find((code) => code === suggestedLanguage)

  batch(() => {
    state.auth.connection = connection
    state.settings.suggestedLanguage = existLanguage ? suggestedLanguage : 'pl'
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

  console.log('[API]: Code from firebase was sent')
  await firebase.sendCode(state.auth, state.settings.language, payload)
  batch(() => {
    state.auth.userId = data.userId
    state.auth.phoneNumber = payload
    state.auth.loading = false
  })
})

createAction('verifyCode', async (state, payload) => {
  const credentials = await firebase.verifyCode(state.auth, state.settings.language, payload)
  const token = await credentials?.user.getIdToken()
  if (!token || state.auth.error) {
    return
  }
  const { data } = await callApi('getTwoFa', token)
  if (!state.auth.userId) {
    batch(() => {
      state.auth.token = token
      state.auth.screen = AuthScreens.SignUp
    })
    return
  } else if (data.getTwoFa) {
    batch(() => {
      state.auth.passwordHint = data.getTwoFa!.hint
      state.auth.email = data.getTwoFa!.email
      state.auth.screen = AuthScreens.Password
    })
    return
  } else {
    const { data } = await callApi('signIn', {
      token,
      connection: {
        ...state.auth.$connection!.value!,
        browser: USER_BROWSER,
        platform: USER_PLATFORM
      },
      userId: state.auth.userId
    })
    if (!data?.signIn) {
      console.warn('[API]: Sign In error')
      return
    }
    if (state.auth.rememberMe) {
      /* persist session */
      /* in localstorage, session_in, or user_auth, smth like  */
    }
    state.auth.isAuthorized = true
  }
  return
})

createAction('signUp', async (state, payload) => {
  const { silent, firstName, lastName, photo } = payload
  if (!state.auth.token || !state.auth.phoneNumber) {
    state.auth.error = 'Phone verification failed'
    console.warn('[API]: SIGN UP ERROR')

    return
  }
  if (!state.auth.$connection) {
    state.auth.connection = await callApi('fetchConnection')
    console.log('[API]: CONNECTION HAS BEEN FETCHED, BECAUSE NOT EXIST')
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
  const response = await callApi('signUp', { input, photo })
  console.log({ response })
})
