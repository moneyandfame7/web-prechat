import {generateRecaptcha} from 'lib/firebase'
import {changeLanguage} from 'lib/i18n'
import type {SignalGlobalState} from 'types/state'

import {IS_APPLE, USER_BROWSER, USER_PLATFORM} from 'common/config'

import {database} from 'lib/database'

import {getGlobalState} from './signal'
import {getActions} from './action'
import {updateGlobalState} from './persist'

/**
 * @todo винести це все в actions??
 */
export async function initializeAuth() {
  const {getConnection} = getActions()
  const state = getGlobalState()

  state.auth.isLoading = true

  getConnection()

  await generateRecaptcha(state.auth)

  if (state.countryList.length && state.auth.connection) {
    state.auth.isLoading = false
  }
}

async function initializeGlobalState() {
  const {auth, settings} = await database.getInitialState()

  updateGlobalState({auth, settings}, false)

  // updateUserList(state, users.users)

  // updateContactList(state, users.contactIds)
}

async function initializeLibraries(state: SignalGlobalState) {
  const packLength = Object.keys(state.settings.i18n.pack)

  if (!packLength) {
    await changeLanguage('en')
  }
}

export async function initializeApplication() {
  const state = getGlobalState()
  const actions = getActions()

  actions.init()
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

  await Promise.all([initializeGlobalState(), initializeLibraries(state)]).finally(() => {
    // if (!state.auth.session && !state.countryList.length) {
    //   logger.error('No countries list')
    //   return
    // }
    setTimeout(() => {
      state.initialization = false
    }, 200)
  })

  if (state.settings.theme === 'light') {
    document.documentElement.classList.add('day')
  }
}
