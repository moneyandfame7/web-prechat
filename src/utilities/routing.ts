import {type Actions} from 'state/action'
import {isValidUsername} from 'state/helpers/chats'
import {selectUsernameByChatId} from 'state/selectors/chats'

import {type SignalGlobalState} from 'types/state'

import {isValidId} from './isValidId'

function parseHash(hash: string): string | undefined {
  const splitted: string | undefined = hash.split('#')[1]
  // if (!splitted) {
  //   return undefined
  // }

  return splitted
  /**
   * We do not remove the "@" from the hash for further handling (switch case)
   */
  // return isValidHash(splitted) ? splitted : undefined
}

function goToPrev(event?: HashChangeEvent) {
  const parsedOld = event ? parseHash(event?.oldURL) : undefined

  return parsedOld && isValidHash(parsedOld)
    ? changeHash({hash: parsedOld, silent: true})
    : undefined
}

function isValidHash(hash: string) {
  return hash[0] === '@' ? isValidUsername(hash.slice(1)) : isValidId(hash)
}

export function connectStateToNavigation(
  global: SignalGlobalState,
  actions: Actions
  // closeChat: VoidFunction
): (event?: HashChangeEvent) => void {
  function handleNavigation(event?: HashChangeEvent) {
    const hash = window.location.hash
    if (hash.length === 0) {
      if (event) {
        // console.log(event.oldURL, 'LALALA')
        // console.log('EMPTY HASH?')
        // closeChat() // !!!IDK WHAT NEED TO DO THERE
        // actions.openChat({id: undefined})
      }
      // console.log({hash, event})
      return resetHash()
      // return changeHash({hash: undefined, silent: true})
    }
    const parsed = parseHash(hash)
    if (!parsed) {
      return goToPrev(event)
    }
    const p = parsed[0]

    switch (p) {
      case '@': {
        const username = parsed.slice(1)
        if (!isValidUsername(username)) {
          actions.showNotification({title: "Sory, this user doesn't seem to exist."})

          goToPrev(event)
        }

        actions.openChatByUsername({username: parsed.slice(1)})
        break
      }
      /**
       * @todo: if user or chat has username - change from ID to username!
       * check that username is from chat id
       */
      default: {
        const username = selectUsernameByChatId(global, parsed)
        const shouldNavigate = !!username && global.currentChat.username !== username

        if (shouldNavigate) {
          changeHash({hash: `@${username}`, silent: true})
        }
        actions.openChat({id: parsed})
      }
    }
  }

  return handleNavigation
}

export function changeHash({
  hash,
  silent = false,
}: {
  hash: string | undefined
  silent?: boolean
}) {
  // const resetUrl = hash
  //   ? window.location.origin + '/#' + hash
  //   : window.location.href.split('#')[0]
  // window.history.replaceState({}, document.title,resetUrl)
  const url = window.location.origin + '/#' + hash
  if (hash) {
    // window.location.hash = `#${hash}`
    if (silent) {
      window.history.replaceState({}, document.title, url)
    } else {
      window.location.hash = `#${hash}`
    }
  } else {
    window.location.hash = ``

    // resetHash()
  }
}

export function resetHash() {
  window.history.pushState({}, document.title, window.location.href.split('#')[0])
}
