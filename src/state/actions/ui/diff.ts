import {createAction} from 'state/action'

import {MODAL_TRANSITION_MS, NOTIFICATION_TRANSITION} from 'common/environment'
import {updateByKey} from 'utilities/object/updateByKey'

import {RightColumnScreens} from 'types/screens'

createAction('showNotification', (state, actions, payload) => {
  const {title} = payload
  if (state.notification.title) {
    return
  }

  updateByKey(state.notification, {
    title,
    isOpen: true,
  })
  // fix transition on notification
  setTimeout(() => {
    actions.closeNotification()
  }, 2000)
})

createAction('closeNotification', (state) => {
  updateByKey(state.notification, {isOpen: false})

  setTimeout(() => {
    state.notification.title = undefined
  }, NOTIFICATION_TRANSITION)
})

createAction('openCommonModal', (state, _actions, payload) => {
  updateByKey(state.commonModal, {...payload, isOpen: true})
})

createAction('closeCommonModal', (state) => {
  updateByKey(state.commonModal, {isOpen: false})

  setTimeout(() => {
    updateByKey(state.commonModal, {title: undefined, body: undefined})
  }, MODAL_TRANSITION_MS)
})

createAction('changeSettingsScreen', (state, _, payload) => {
  state.globalSettingsScreen = payload

  /* мейбі поставити його undefined пізніше. */
})

createAction('copyToClipboard', (_, actions, payload) => {
  const {toCopy, title} = payload
  navigator.clipboard.writeText(toCopy)

  actions.showNotification({
    title,
  })
})

createAction('openRightColumn', (state, _, payload) => {
  const {screen} = payload
  state.rightColumn = {
    isOpen: true,
    screen: screen || RightColumnScreens.ChatProfile,
  }
})

createAction('closeRightColumn', (state) => {
  state.rightColumn.isOpen = false
})

createAction('toggleMessageSelection', (state, _, payload) => {
  const {active, id} = payload
  const selected = state.selection.messageIds

  if (typeof active === 'boolean') {
    state.selection.hasSelection = active
  }
  if (!id) {
    if (state.selection.hasSelection === false) {
      console.log('CLEAR SELECTION!!!')
      state.selection.messageIds = []
    }
    return
  }
  // if (selected.includes(id)) {
  //   console.log('SHOULD REMOVE!!!!')
  //   state.selection.messageIds.filter
  // } else {
  //   selected.push(id)
  //   state.selection.hasSelection = true
  // }
  if (selected.includes(id)) {
    if (selected.length === 1) {
      state.selection.messageIds = []
      state.selection.hasSelection = false
    } else {
      state.selection.messageIds = state.selection.messageIds.filter(
        (existingId) => existingId !== id
      )
    }
  } else {
    selected.push(id)
    state.selection.hasSelection = true
  }
})
