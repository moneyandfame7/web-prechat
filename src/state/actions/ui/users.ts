import {createAction} from 'state/action'

import {resetNewContactState, updateNewContactState} from 'state/updates'

createAction('openCreateContactModal', (state) => {
  updateNewContactState(state, {
    isByPhoneNumber: true,
    userId: undefined
  })
})

createAction('openAddContactModal', (state, _, payload) => {
  updateNewContactState(state, {
    userId: payload.userId,
    isByPhoneNumber: false
  })
})

createAction('closeAddContactModal', (state) => {
  resetNewContactState(state)
})
