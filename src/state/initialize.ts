import { init } from 'emoji-mart'

import { makeRequest } from 'api/request'

import { setLanguage } from 'lib/i18n'
import { generateRecaptcha } from 'lib/firebase'

import { getGlobalState } from './signal'
import { getActions } from './action'
import { batch } from '@preact/signals'

function initializeSettings() {
  const state = getGlobalState()

  switch (state.settings.theme) {
    case 'dark':
      document.documentElement.classList.add('dark')
      break
    case 'light':
      document.documentElement.classList.remove('dark')
      break
  }
}

export async function initializeAuth() {
  const state = getGlobalState()
  const { getConnection } = getActions()

  state.auth.loading = true

  await getConnection()
  generateRecaptcha(state).then((id) => {
    batch(() => {
      state.auth.captchaId = id
      state.auth.loading = false
    })
  })
}

export function initializeGlobalState() {
  // eslint-disable-next-line no-console
  console.log('Initialize state')
  initializeSettings()
}

async function initializeLibraries() {
  const language = getGlobalState((state) => state.settings.language)
  setLanguage(language)
  const emojis = await makeRequest('emojis')
  await init({ data: emojis })
  /* load i18n here? */
}

export async function initializeApplication() {
  const state = getGlobalState()
  state.initialization = true
  initializeGlobalState()
  await initializeLibraries()
  setTimeout(() => {
    state.initialization = false
  }, 350)
}
