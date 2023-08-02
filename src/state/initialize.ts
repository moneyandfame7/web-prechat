import {generateRecaptcha} from 'lib/firebase'
import {changeLanguage} from 'lib/i18n'
import type {SignalGlobalState} from 'types/state'

import {IS_APPLE, USER_BROWSER, USER_PLATFORM} from 'common/config'

import {database} from 'lib/database'

import {getGlobalState} from './signal'
import {getActions} from './action'
import {updateGlobalState} from './persist'
import type {ApiUser} from 'types/api'
import {updateContactList, updateUserList} from './updates/contacts'

/**
 * @todo винести це все в actions??
 */
export async function initializeAuth() {
  const {getConnection} = getActions()
  const state = getGlobalState()

  state.auth.loading = true

  await getConnection()
  await generateRecaptcha(state.auth)

  state.auth.loading = false
}

async function initializeGlobalState() {
  const state = getGlobalState()
  const {auth, settings, users} = await database.getInitialState()

  updateGlobalState({auth, settings}, false)

  updateUserList(state, users.users)
  updateContactList(state, users.contactIds)
}

async function initializeLibraries(state: SignalGlobalState) {
  /* Init i18n */
  const countriesLength = Object.keys(state.settings.i18n.countries).length
  const packLength = Object.keys(state.settings.i18n.pack)
  const errorsLength = Object.keys(state.settings.i18n.errors)

  if (!countriesLength || !packLength || !errorsLength) {
    await changeLanguage('en')
  }
}

export async function initializeApplication() {
  const state = getGlobalState()
  state.initialization = true
  if (USER_PLATFORM === 'macOS') {
    document.documentElement.classList.add('is-mac')
  }
  if (IS_APPLE) {
    document.documentElement.classList.add('is-apple')
  }
  if (USER_BROWSER.startsWith('Safari')) {
    document.documentElement.classList.add('is-safari')
  }
  await Promise.all([initializeGlobalState(), initializeLibraries(state)]).finally(
    () => (state.initialization = false)
  )
  if (state.settings.theme === 'light') {
    document.documentElement.classList.add('day')
  }

  // setTimeout(() => {
  state.initialization = false
  // }, 200)
}
