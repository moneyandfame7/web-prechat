import {getActions} from 'state/action'
import {isValidUsername} from 'state/helpers/chats'

import {isValidId} from './isValidId'

function parseHash(hash: string) {
  return hash.split('#')[1]
}

function goToPrev(event?: HashChangeEvent) {
  console.log('> GO_PREV_HASH')
  const parsedOld = event ? parseHash(event?.oldURL) : undefined

  if (!parsedOld) {
    changeHash()
    return false
  }
  if (isValidHash(parsedOld)) {
    changeHash(parsedOld)
    return true
  }
  changeHash()

  return false
}

function isValidHash(hash: string) {
  return hash[0] === '@' ? isValidUsername(hash.slice(1)) : isValidId(hash)
}

export function handleHashChangeTEST(event?: HashChangeEvent) {
  const actions = getActions()
  const hash = window.location.hash
  if (hash.length === 0) {
    return
  }
  const parsed = parseHash(hash)

  const p = parsed[0]

  // const chatId = username ? undefined : parsed
  switch (p) {
    case '@': {
      const username = parsed.slice(1)
      if (!isValidUsername(username)) {
        actions.showNotification({title: "Sory, this user doesn't seem to exist."})

        goToPrev(event)
      }

      actions.resolveUsername({username: parsed.slice(1)})
      break
    }

    default: {
      if (!isValidId(parsed)) {
        console.error('> INVALID_PEER_ID')
        goToPrev(event)

        return
      }

      console.log('> FETCH CHAT BY ID')
      /*  */
    }
  }
  // const message = parsed.split('M')[1]
}

export function changeHash(hash?: string) {
  const toResetHash = hash || window.location.href.split('#')[0]

  window.history.replaceState({}, document.title, toResetHash)
}
