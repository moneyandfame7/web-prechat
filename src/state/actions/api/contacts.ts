import {Api} from 'api/manager'

import {createAction} from 'state/action'
import {updateChats, updateUsers} from 'state/updates'

import {logger} from 'utilities/logger'
import {buildRecord} from 'utilities/object/buildRecord'
import {unformatStr} from 'utilities/string/stringRemoveSpacing'

createAction('getContactList', async (state) => {
  const users = await Api.contacts.getContacts()
  if (!users) {
    return
  }

  updateUsers(state, buildRecord(users, 'id'))

  console.log(users[0])
  // updateUserStatuses(state,buildRecord)
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
    userId: payload.userId,
  })
  /**
   * @todo rewrite for result<data, error>
   */
  if (!result) {
    actions.showNotification({title: 'The provided phone not registered.'})
    return
  }
  const {chat, user} = result
  updateUsers(state, {
    [user.id]: user,
  })
  updateChats(state, {
    [chat.id]: chat,
  })
  actions.closeAddContactModal()

  if (payload.userId) {
    /* Open chat */
  }

  /*  */
})
