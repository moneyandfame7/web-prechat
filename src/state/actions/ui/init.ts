import * as cache from 'lib/cache'

import {createAction} from 'state/action'
import {INITIAL_STATE, readPersist, resetPersist, setGlobalState} from 'state/persist'
import {resetAuthState} from 'state/updates/auth'
import {IS_APPLE, USER_BROWSER, USER_PLATFORM} from 'common/config'
import {changeLanguage} from 'lib/i18n'

createAction('reset', async (state, actions) => {
  resetPersist()
  resetAuthState(state)

  cache.clear('prechat-avatars')
  cache.clear('prechat-i18n-pack')
  cache.clear('prechat-i18n-string')
  cache.clear('prechat-assets')

  actions.init()
})

createAction('init', async (state) => {
  console.time('INIT>>>')
  state.initialization = true
  const persisted = (await readPersist()) || INITIAL_STATE

  if (USER_PLATFORM === 'macOS') {
    document.documentElement.classList.add('is-mac')
  }
  if (IS_APPLE) {
    document.documentElement.classList.add('is-apple')
  }
  if (USER_BROWSER.startsWith('Safari')) {
    document.documentElement.classList.add('is-safari')
  }

  if (persisted.settings.theme === 'dark') {
    document.documentElement.classList.add('night')
  }

  const packLength = Object.keys(persisted?.settings?.i18n.pack)
  if (!packLength) {
    await changeLanguage(persisted.settings.suggestedLanguage || 'en')
  }

  setGlobalState(persisted)
  // setTimeout(() => {
  state.initialization = false
  // }, 400)

  console.timeEnd('INIT>>>')
})
