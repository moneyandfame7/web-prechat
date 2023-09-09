import type {ApiUser} from 'api/types/users'

import type {BuildedRecord} from 'utilities/object/buildRecord'

import type {SignalGlobalState} from 'types/state'

export function selectContacts(global: SignalGlobalState): BuildedRecord<ApiUser> {
  return global.users.contactIds.reduce((byKey, id) => {
    byKey[id] = global.users.byId[id]

    return byKey
  }, {} as BuildedRecord<ApiUser>)
}

export function selectUser(global: SignalGlobalState, userId: string): ApiUser | undefined {
  return global.users.byId[userId]
}

export function selectUserStatus(global: SignalGlobalState, userId: string) {
  return global.users.statusesByUserId[userId]
}

export function selectIsOnline(user: ApiUser) {
  const status = user.status

  if (status && status.type === 'userStatusOnline') {
    return true
  }

  return false
}

export function selectSelf(global: SignalGlobalState): ApiUser | undefined {
  return global.users.byId[global.auth.userId!]
}
