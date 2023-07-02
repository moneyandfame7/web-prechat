import { generateRecaptcha } from 'lib/firebase'
import { changeLanguage } from 'lib/i18n'

import { getGlobalState } from './signal'
import { getActions } from './action'
import { database } from './database'
import { updateGlobalState } from './persist'

export async function initializeAuth() {
  const state = getGlobalState()
  const { getConnection } = getActions()
  state.auth.loading = true
  await getConnection()
  await generateRecaptcha(state.auth)

  state.auth.loading = false
}

async function initializeGlobalState() {
  const persisted = await database.getInitialState()
  updateGlobalState(persisted)
}

async function initializeLibraries() {
  /* Init i18n */
  await changeLanguage('en')
}

export async function initializeApplication() {
  const state = getGlobalState()
  state.initialization = true

  await initializeGlobalState()
  await initializeLibraries()

  setTimeout(() => {
    state.initialization = false
  }, 500)
}
