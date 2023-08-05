import {Api} from 'api/manager'

import {createAction} from 'state/action'
import {updateUsers} from 'state/updates'

import {logger} from 'utilities/logger'
import {buildRecord} from 'utilities/object/buildRecord'
import {unformatStr} from 'utilities/stringRemoveSpacing'

createAction('getContactList', async (state) => {
  const users = await Api.contacts.getContacts()
  if (!users) {
    return
  }

  updateUsers(state, buildRecord(users, 'id'))

  // contactIds.map((id) => {
  //   actions.getUser(id)
  // })
})

createAction('addContact', async (state, actions, payload) => {
  if (payload.userId === state.auth.userId) {
    logger.warn('SELF ID CANNOT ADD TO CONTACT!!!)))')
    return
  }
  // in result ApiUser.
  const result = await Api.contacts.addContact({
    firstName: payload.firstName,
    lastName: payload.lastName,
    phoneNumber: unformatStr(payload.phone),
    userId: payload.userId
  })

  if (!result) {
    actions.showNotification({title: 'The provided phone not registered.'})
    return
  }

  updateUsers(
    state,
    {
      [result.id]: result
    },
    true
  )
  actions.closeAddContactModal()

  if (payload.userId) {
    /* Open chat */
  }

  /*  */
})
