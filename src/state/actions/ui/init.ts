import * as cache from 'lib/cache'
import {database} from 'lib/database'

import {createAction} from 'state/action'
import {
  INITIAL_STATE,
  readPersist,
  removePersist,
  setGlobalState,
  updateGlobalState
} from 'state/persist'

import {removeSession} from 'utilities/session'

createAction('reset', (state, actions) => {
  removeSession()
  removePersist()

  cache.clear('prechat-avatars')
  cache.clear('prechat-i18n-pack')
  cache.clear('prechat-i18n-string')
  cache.clear('prechat-assets')

  actions.init()
})

createAction('init', async (state, actions) => {
  const {auth, settings} = await database.getInitialState()

  updateGlobalState({auth, settings}, false)
  const loadedPersist = readPersist(INITIAL_STATE) || INITIAL_STATE

  /* if has passcode, upd settings here */

  setGlobalState(loadedPersist)
})
