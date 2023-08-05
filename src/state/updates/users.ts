import type {ApiUser} from 'api/types/users'
import type {GlobalState, SignalGlobalState} from 'types/state'

import {updateByKey} from 'utilities/object/updateByKey'

const initialNewContact: GlobalState['newContact'] = {
  userId: undefined,
  isByPhoneNumber: false
}
// const initialUsers: GlobalState['users'] = {
//   byId: {},
//   contactIds: []
// }

export function resetNewContactState(global: SignalGlobalState) {
  updateByKey(global.newContact, initialNewContact)
}

export function updateNewContactState(
  global: SignalGlobalState,
  newContact: GlobalState['newContact']
) {
  updateByKey(global.newContact, newContact)
}

export function updateUser(
  global: SignalGlobalState,
  id: string,
  updUser: Partial<ApiUser>
) {
  const user = global.users.byId[id]
  if (!user) {
    return
  }

  updateByKey(user, updUser)

  updateContactList(global, [user])
}

export function updateUsers(
  global: SignalGlobalState,
  usersById: Record<string, ApiUser>,
  shouldOverwrite = false
) {
  Object.keys(usersById).forEach((id) => {
    if (!shouldOverwrite && global.chats.byId[id]) {
      return
    }
    updateByKey(global.users.byId, {
      [id]: usersById[id]
    })
  })

  updateContactList(global, Object.values(usersById))
}

export function updateContactList(global: SignalGlobalState, users: ApiUser[]) {
  const contactsList = global.users.contactIds

  const updatedList = users
    .filter((u) => u.isContact && !contactsList.includes(u.id))
    .map((u) => u.id)

  if (updatedList.length === 0) {
    return
  }

  global.users.contactIds.push(...updatedList)
}
