import {Api} from 'api/client'
import {createAction} from 'state/action'
import {updateGlobalState} from 'state/persist'
import {throttle} from 'utilities/throttle'

const SEARCH_USERS_LIMIT = 10

const SEARCH_GLOBAL_LIMIT = 20

const throttledSearch = throttle((cb) => cb(), 500, false)
createAction('searchGlobal', async (state, actions, payload) => {
  if (!payload.length) {
    return
  }

  void throttledSearch(async () => {})
})

createAction('searchUsers', async (state, _, payload) => {
  if (!payload.length) {
    return
  }

  state.globalSearch.isLoading = true

  void throttledSearch(async () => {
    state.globalSearch = {
      'isLoading': false
    }
  })
})
