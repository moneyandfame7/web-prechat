import {generateRecaptcha} from 'lib/firebase'

import {getGlobalState} from './signal'
import {getActions} from './action'

/**
 * @todo винести це все в actions??
 */
export async function initializeAuth() {
  const {getConnection} = getActions()
  const state = getGlobalState()

  state.auth.isLoading = true

  getConnection()
  state.auth.isLoading = true

  getConnection()

  await generateRecaptcha(state.auth)

  if (state.countryList.length && state.auth.connection) {
    state.auth.isLoading = false
  }
}

export async function initializeApplication() {
  const actions = getActions()

  await actions.init()
}
