import {ApolloClient} from 'api/manager'

import {createAction} from 'state/action'
import {changeMessageSize, toggleAnimations, toggleBlur} from 'state/helpers/settings'
import {INITIAL_STATE} from 'state/initState'
import {setGlobalState} from 'state/signal'
import {hydrateStore, stopPersist} from 'state/storages'

import * as cache from 'lib/cache'

import {IS_APPLE, USER_BROWSER, USER_PLATFORM} from 'common/environment'
import {changeTheme} from 'utilities/changeTheme'
import {deepCopy} from 'utilities/object/deepCopy'
import {changeHash} from 'utilities/routing'

createAction('reset', async (_state) => {
  await ApolloClient.client.clearStore()
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

createAction('init', async (state, actions): Promise<void> => {
  state.initialization = true
  await hydrateStore()

  if (USER_PLATFORM === 'macOS') {
    document.documentElement.classList.add('is-mac')
  }
  if (IS_APPLE) {
    document.documentElement.classList.add('is-apple')
  }
  if (USER_BROWSER.includes('Firefox')) {
    document.documentElement.classList.add('is-firefox')
  }
  if (USER_BROWSER.startsWith('Safari')) {
    document.documentElement.classList.add('is-safari')
  }

  changeTheme(state.settings.general.theme)
  changeMessageSize(state.settings.general.messageTextSize)

  const test = state.settings.general.animationsEnabled
  toggleAnimations(test)
  toggleBlur(state.settings.general.blur)
  actions.getConnection()
  // const packLength = Object.keys(persisted?.settings?.i18n.pack)
  // if (!packLength) {
  //   await changeLanguage(persisted.settings.suggestedLanguage || 'en')
  // }

  // setGlobalState(persisted)

  /*  avoid flickering loading screen */
  setTimeout(() => {
    state.initialization = false
  }, 400)

  // console.log({global: state})
})
