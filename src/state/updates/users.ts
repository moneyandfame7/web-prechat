import type {ApiUser} from 'api/types/users'

import {selectUser} from 'state/selectors/users'
import {storages} from 'state/storages'

import {updateByKey} from 'utilities/object/updateByKey'

import type {GlobalState, SignalGlobalState} from 'types/state'

const initialNewContact: GlobalState['newContact'] = {
  userId: undefined,
  isByPhoneNumber: false,
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

export function updateUser(global: SignalGlobalState, id: string, updUser: Partial<ApiUser>) {
  const user = selectUser(global, id)
  if (!user) {
    return
  }

  updateByKey(user, updUser)

  /* OR JUST TAKE UPDATED USER BY ID?? */
  storages.users.put({
    [id]: user, // ???
    /**
     * {
     * ...user,
     * ...updUser
     * }
     */
  })

  updateContactList(global, [user])
}

export function updateUsers(global: SignalGlobalState, usersById: Record<string, ApiUser>) {
  updateByKey(global.users.byId, usersById)

  // storageManager.users.set(usersById)
  storages.users.put(usersById)

  updateContactList(global, Object.values(usersById))
}

export function updateContactList(global: SignalGlobalState, users: ApiUser[]) {
  const contactsList = global.users.contactIds
  // if (users.length === 1 && users[0].isContact) {
  //   // ??????
  //   return
  // }
  const updatedList = users
    // filter by isContact from API, but not added local to list
    .filter((u) => u.isContact && !contactsList.includes(u.id))
    .map((u) => u.id)

  if (updatedList.length === 0) {
    return
  }

  global.users.contactIds.push(...updatedList)
}
