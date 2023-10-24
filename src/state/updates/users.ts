import type {ApiUser} from 'api/types/users'

import {selectUser} from 'state/selectors/users'
import {storages} from 'state/storages'

import {updateByKey} from 'utilities/object/updateByKey'

import type {GlobalState, SignalGlobalState} from 'types/state'

import {updateUsernamesFromPeers} from './chats'

const initialNewContact: GlobalState['newContact'] = {
  isOpen: false,
  userId: undefined,
  isByPhoneNumber: false,
}

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
  })

  // storages.users.

  updateContactList(global, [user])
}

export function updateUsers(global: SignalGlobalState, usersById: Record<string, ApiUser>) {
  updateByKey(global.users.byId, usersById)

  // storageManager.users.set(usersById)
  storages.users.put(usersById)

  const usersList = Object.values(usersById)

  updateContactList(global, usersList)
  updateUsernamesFromPeers(global, usersList)
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
