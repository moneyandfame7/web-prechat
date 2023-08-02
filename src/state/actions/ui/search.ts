import {createAction} from 'state/action'

createAction('searchGlobalClear', (state) => {
  state.globalSearch = {
    isLoading: false,
    known: {
      users: []
    },
    global: {
      users: []
    }
  }
})
