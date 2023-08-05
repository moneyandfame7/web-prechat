import type {ApiUser} from 'api/types/users'
import type {SignalGlobalState} from 'types/state'
import type {BuildedRecord} from 'utilities/object/buildRecord'

export function selectContacts(global: SignalGlobalState): BuildedRecord<ApiUser> {
  return global.users.contactIds.reduce((byKey, id) => {
    byKey[id] = global.users.byId[id]

    return byKey
  }, {} as BuildedRecord<ApiUser>)
}

export function selectUser(global: SignalGlobalState, userId: string) {
  return global.users.byId[userId]
}
