import type {ApiUser} from 'types/api'

export function getDisplayedUserName(u: ApiUser) {
  return u.isSelf ? 'Saved Messages' : u.firstName + ' ' + u.lastName
}
