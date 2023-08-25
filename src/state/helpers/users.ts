import type {ApiUser} from 'types/api'

export function getDisplayedUserName(u: ApiUser) {
  // eslint-disable-next-line prefer-template
  return u.isSelf ? 'Saved Messages' : u.firstName + ' ' + u.lastName
}
