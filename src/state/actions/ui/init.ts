import {createAction} from 'state/action'
import {INITIAL_STATE} from 'state/initState'
import {setGlobalState} from 'state/signal'
import {hydrateStore, stopPersist} from 'state/storages'

import * as cache from 'lib/cache'

import {IS_APPLE, USER_BROWSER, USER_PLATFORM} from 'common/config'
import {deepCopy} from 'utilities/object/deepCopy'
import {changeHash} from 'utilities/routing'

createAction('reset', async (_state) => {
  await stopPersist()
  changeHash({hash: undefined})
  // resetAuthState(state)
  cache.clear('prechat-avatars')
  cache.clear('prechat-i18n-pack')
  cache.clear('prechat-i18n-string')
  cache.clear('prechat-assets')

  setGlobalState(deepCopy(INITIAL_STATE))
  // _state.auth.session = undefined
  // await actions.init() // ????
})

createAction('init', async (state): Promise<void> => {
  state.initialization = true
  await hydrateStore()

  if (USER_PLATFORM === 'macOS') {
    document.documentElement.classList.add('is-mac')
  }
  if (IS_APPLE) {
    document.documentElement.classList.add('is-apple')
  }
  if (USER_BROWSER.startsWith('Safari')) {
    document.documentElement.classList.add('is-safari')
  }

  if (state.settings.general.theme === 'dark') {
    document.documentElement.classList.add('night')
  }

  // const packLength = Object.keys(persisted?.settings?.i18n.pack)
  // if (!packLength) {
  //   await changeLanguage(persisted.settings.suggestedLanguage || 'en')
  // }

  // setGlobalState(persisted)

  /* for avoid flickering loading screen */
  setTimeout(() => {
    state.initialization = false
  }, 400)

  console.log({global: state})
})
