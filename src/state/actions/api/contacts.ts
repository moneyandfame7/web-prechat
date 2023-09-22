import {getApiError} from 'api/helpers/getApiError'
import {Api} from 'api/manager'

import {createAction} from 'state/action'
import {updateUsers} from 'state/updates'

import {logger} from 'utilities/logger'
import {buildRecord} from 'utilities/object/buildRecord'
import {unformatStr} from 'utilities/string/stringRemoveSpacing'

createAction('getContactList', async (state) => {
  const users = await Api.contacts.getContacts()
  if (!users) {
    return
  }

  updateUsers(state, buildRecord(users, 'id'))

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
  try {
    const result = await Api.contacts.addContact({
      firstName: payload.firstName,
      lastName: payload.lastName,
      phoneNumber: unformatStr(payload.phone),
      userId: payload.userId,
    })
    if (!result) {
      return
    }

    updateUsers(state, {
      [result.id]: result,
    })
    // updateChats(state, {
    // [chat.id]: chat,
    // })
    actions.closeAddContactModal()

    // settimeout?
    actions.openChat({id: result.id, shouldChangeHash: true})
    /**
     * @todo if added by phone - open chat with him
     */
    // if (payload.userId) {
    //   /* Open chat */
    //   actions.openChat({id: payload.userId})
    // }
  } catch (e) {
    const error = getApiError(e)
    switch (error?.code) {
      case 'PHONE_NUMBER_NOT_FOUND':
        actions.showNotification({title: 'The provided phone not registered.'})
    }
  }
})
