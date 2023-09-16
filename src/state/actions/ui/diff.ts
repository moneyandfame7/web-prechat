import {createAction} from 'state/action'
import {updateCommonModalState, updateNotificationState} from 'state/updates/diff'

import {MODAL_TRANSITION_MS, NOTIFICATION_TRANSITION} from 'common/config'
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

createAction('openRightColumn', (state, actions, payload) => {
  const {screen} = payload
  state.rightColumn = {
    isOpen: true,
    screen: screen || RightColumnScreens.ChatProfile,
  }
})

createAction('closeRightColumn', (state) => {
  state.rightColumn.isOpen = false
})
