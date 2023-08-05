import {createAction} from 'state/action'
import {updateNotificationState} from 'state/updates/diff'

import {NOTIFICATION_TRANSITION} from 'common/config'

createAction('showNotification', (state, actions, payload) => {
  const {title} = payload
  if (state.notification.title) {
    return
  }

  updateNotificationState(state, {
    title,
    isOpen: true
  })
  // fix transition on notification
  setTimeout(() => {
    actions.closeNotification()
  }, 2000)
})

createAction('closeNotification', (state) => {
  updateNotificationState(state, {isOpen: false})

  setTimeout(() => {
    state.notification.title = undefined
  }, NOTIFICATION_TRANSITION)
})

createAction('changeSettingsScreen', (state, _, payload) => {
  state.globalSettingsScreen = payload

  /* мейбі поставити його undefined пізніше. */
})

createAction('copyToClipboard', (_, actions, payload) => {
  const {toCopy, title} = payload
  navigator.clipboard.writeText(toCopy)

  actions.showNotification({
    title
  })
})
