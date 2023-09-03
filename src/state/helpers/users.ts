import type {ApiUser} from 'api/types'

import {formatDate} from 'utilities/date/convert'
import {isYesterday} from 'utilities/date/isYesterday'
import {milliseconds} from 'utilities/date/ms'

export function getDisplayedUserName(u: ApiUser) {
  // eslint-disable-next-line prefer-template
  return u.isSelf ? 'Saved Messages' : u.firstName + ' ' + u.lastName
}

export function getUserStatus(u: ApiUser) {
  const now = Date.now()

  switch (u.status?.type) {
    case 'userStatusOffline': {
      const timeDelta = now - u.status.wasOnline
      /**
       * add pluralize, interpolate
       */
      if (timeDelta < milliseconds({minutes: 1})) {
        return 'last seen just now'
      } else if (timeDelta < milliseconds({minutes: 60})) {
        const minutes = Math.round(timeDelta / (1000 * 60))
        return `last seen ${minutes} minutes ago`
      } else if (timeDelta < milliseconds({hours: 24})) {
        const hours = Math.round(timeDelta / (1000 * 60 * 60))
        return `last seen ${hours} hours ago`
      } else if (isYesterday(new Date(now))) {
        return `last seen yesterday at ${formatDate(
          new Date(u.status.wasOnline),
          true,
          false
        )}`
      }
      return formatDate(new Date(u.status.wasOnline), true, true)
    }
    case 'userStatusLastMonth':
      return 'last seen within a month'
    case 'userStatusLastWeek':
      return 'last seen within a week'
    case 'userStatusLongTimeAgo':
      return 'last seen a long time ago'
    case 'userStatusOnline':
      return 'online'
    case 'userStatusRecently':
      return 'last seen a recently'
    /* if date < 1 minute ago "just now" */
  }
}

export function getUserName(user: ApiUser) {
  return user.firstName
    ? `${user.firstName}${user.lastName ? ` ${user.lastName}` : ''}`
    : user.lastName || ''
}
