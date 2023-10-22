import {createAction} from 'state/action'
import {resetNewContactState, updateNewContactState} from 'state/updates'

import {MODAL_TRANSITION_MS} from 'common/environment'

createAction('openCreateContactModal', (state) => {
  updateNewContactState(state, {
    isByPhoneNumber: true,
    userId: undefined,
    isOpen: true,
  })
})

createAction('openAddContactModal', (state, _, payload) => {
  updateNewContactState(state, {
    userId: payload.userId,
    isByPhoneNumber: false,
    isOpen: true,
  })
})

createAction('closeAddContactModal', (state) => {
  state.newContact.isOpen = false

  setTimeout(() => {
    resetNewContactState(state)
  }, MODAL_TRANSITION_MS)
})
