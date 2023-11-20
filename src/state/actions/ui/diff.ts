import {batch} from '@preact/signals'

import {createAction} from 'state/action'
import {selectCurrentChat} from 'state/selectors/chats'
import {selectMessage} from 'state/selectors/messages'

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

createAction('toggleMessageEditing', (state, _, payload) => {
  const {id, active} = payload
  const currentChat = selectCurrentChat(state)
  if (!currentChat?.chatId) {
    return
  }
  if (!active) {
    batch(() => {
      updateByKey(state.messageEditing, {
        isActive: false,
        messageId: undefined,
      })
    })
  } else if (id) {
    const message = selectMessage(state, currentChat.chatId, id)
    if (!message) {
      return
    }
    batch(() => {
      updateByKey(state.messageEditing, {
        isActive: true,
        messageId: id,
      })
    })
  }
})
