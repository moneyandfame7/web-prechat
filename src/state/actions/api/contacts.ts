import {Api} from 'api/client'
import {createAction} from 'state/action'
import {updateContactList} from 'state/updates/contacts'

createAction('getContactList', async (state, actions) => {
  const result = await Api.contacts.getContacts()
  const contactIds = result.data.getContacts
  if (!contactIds) {
    return
  }

  updateContactList(state, result.data.getContacts)

  contactIds.map((id) => {
    console.log({id})
    actions.getUser(id)
  })
})
