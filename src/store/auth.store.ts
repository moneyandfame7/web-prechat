import type {ConfirmationResult, RecaptchaVerifier} from 'firebase/auth'

import {Api} from 'api/manager'
import type {ApiLangCode, AuthSignUpInput} from 'api/types'

import * as firebase from 'lib/firebase'

import {createStore} from 'lib/store'
import {unformatStr} from 'utilities/string/stringRemoveSpacing'
import {deepUpdate} from 'utilities/object/deepUpdate'

import type {UserConnection} from 'types/request'
import {AuthScreens} from 'types/screens'

import {USER_BROWSER, USER_PLATFORM} from 'common/config'
import type {SignInPayload, SignUpPayload} from 'types/action'

import {settingsStore} from './settings.store'
import {startPersist} from './storages/helpers'
import {uiStore} from './ui.store'
import {makeRequest} from 'utilities/makeRequest'
import {LANGUAGES_CODE_ARRAY} from 'state/helpers/settings'

export interface AuthState {
  isLoading: boolean
  error?: string
  rememberMe: boolean
  phoneNumber?: string
  connection?: UserConnection
  currentUserId?: string
  firebase_token?: string
  session?: string
  screen: AuthScreens
  captcha?: RecaptchaVerifier
  confirmResult?: ConfirmationResult
}
/* Create store twoFaStore? hint, email, etc */

const initialState: AuthState = {
  isLoading: false,
  rememberMe: true,
  screen: AuthScreens.PhoneNumber
}
export const authStore = createStore({
  name: 'authStore',
  initialState,
  actionHandlers: {
    mockAuth: (state) => {
      state.session = 'PAVAPEPEGEMABODY'
    },
    init: async (state) => {
      state.isLoading = true
      if (!state.connection) {
        const connection = await makeRequest('connection')

        const suggestedLanguage = connection.countryCode.toLowerCase() as ApiLangCode
        const existLanguage = LANGUAGES_CODE_ARRAY.find(
          (code) => code === suggestedLanguage
        )

        state.connection = connection
        settingsStore.setState({
          suggestedLanguage: existLanguage ? suggestedLanguage : 'en'
        })
      }

      firebase.generateRecaptcha(state)

      state.isLoading = false
    },
    sendPhone: async (state, payload: string) => {
      state.isLoading = true

      const unformatted = unformatStr(payload)

      const response = await Api.auth.sendPhone(unformatted)
      if (!response) {
        state.isLoading = false
        return
      }
      /* Validate has active session, then send code from app. */
      const {language} = settingsStore.getState()
      const successfully = await firebase.sendCode(state, language, unformatted)

      if (!successfully) {
        return
      }

      deepUpdate(state, {
        screen: AuthScreens.Code,
        currentUserId: response.userId,
        phoneNumber: payload,
        isLoading: false
      })

      console.log({state}, 'SEND PHONE')
    },
    verifyCode: async (state, payload: string) => {
      state.isLoading = true
      const {language} = settingsStore.getState()

      const firebase_token = await firebase.verifyCode(state, language, payload)

      if (!firebase_token || state.error) {
        return
      }

      /**
       *  Check two fa settings with firebaseToken, if has password
       *  ( try sign in, it return _ with "signUpRequired" | "passwordRequired" |"authDone")
       */
      if (state.currentUserId) {
        authStore.actions.signIn({firebase_token})
      }
    },
    signIn: async (state, payload: SignInPayload) => {
      state.isLoading = true

      const response = await Api.auth.signIn({
        firebase_token: payload.firebase_token,
        phoneNumber: unformatStr(state.phoneNumber!),
        connection: {
          ...state.connection!,
          browser: USER_BROWSER,
          platform: USER_PLATFORM
        }
      })

      if (!response) {
        state.isLoading = false
        return
      }

      state.isLoading = false
      if (state.rememberMe) {
        authStore.actions.saveSession(response.sessionHash)
      }
    },
    signUp: async (state, payload: SignUpPayload) => {
      state.isLoading = true

      const {silent, firstName, lastName, photo} = payload

      if (!state.firebase_token || !state.phoneNumber) {
        return
      }

      const unformatted = unformatStr(state.phoneNumber)

      const input: AuthSignUpInput['input'] = {
        silent,
        firstName,
        lastName,
        phoneNumber: unformatted,
        connection: {
          ...state.connection!,
          browser: USER_BROWSER,
          platform: USER_PLATFORM
        },
        firebase_token: state.firebase_token
      }

      const response = await Api.auth.signUp({input, photo})

      if (!response) {
        state.isLoading = false
        return
      }

      state.isLoading = false
      if (state.rememberMe) {
        authStore.actions.saveSession(response.sessionHash)
      }
    },
    signOut: async () => {
      /* call api, then */
      await uiStore.actions.reset()
    },
    saveSession: async (state, payload: string) => {
      state.session = payload
      await startPersist()
    }
  }
})

// const {sendPhone, verifyCode, signIn, signOut, signUp} = authStore.actions
