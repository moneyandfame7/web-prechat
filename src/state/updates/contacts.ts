/* eslint-disable array-callback-return */
import type {ApiUser} from 'types/api'
import type {SignalGlobalState} from 'types/state'

export function updateContactList<T extends SignalGlobalState>(state: T, ids: string[]) {
  ids.map((id) => {
    if (!state.users.contactIds.includes(id)) {
      state.users.contactIds.push(id)
    }
  })
}

export function updateUserList<T extends SignalGlobalState>(state: T, users: ApiUser[]) {
  users.map((u) => {
    state.users.byId[u.id] = u
  })
}
