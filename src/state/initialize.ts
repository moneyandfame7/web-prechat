import type { SignalGlobalState } from 'types/state'
import { generateRecaptcha } from 'lib/firebase'

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

export async function initializeGlobalState() {
  const persisted = await database.getInitialState()
  updateGlobalState(persisted)
}

async function initializeLibraries(state: SignalGlobalState) {
  const { getLanguageWithCountries } = getActions()

  /* Init i18n */
  await getLanguageWithCountries(state.settings.suggestedLanguage || 'en')
}

export async function initializeApplication() {
  const state = getGlobalState()
  state.initialization = true

  await initializeGlobalState()
  await initializeLibraries(state)

  setTimeout(() => {
    state.initialization = false
  }, 500)
}
