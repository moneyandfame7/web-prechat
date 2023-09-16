import type {ApiUser} from 'api/types'
import type {ApiMessage, ApiMessageAction} from 'api/types/messages'

import {parseStringToJSX} from 'lib/i18n/helpers'
import {TEST_translate} from 'lib/i18n/types'

import {getUserName} from './users'

export function getMessageActionText(action: ApiMessageAction, sender?: ApiUser) {
  switch (action.type) {
    case 'chatCreate': {
      const trans = TEST_translate('Notification.CreatedChatWithTitle', {
        name: sender ? getUserName(sender) : 'suka hz 4e eto',
        title: action.values[0],
      })
      return trans
    }
    default:
      return 'Not Supported now'
  }
}
export function getMessageText(message?: ApiMessage, sender?: ApiUser) {
  let text: string
  if (message?.action) {
    text = getMessageActionText(message.action, sender)
  } else {
    text = message?.text || 'EMPTY_MESSAGE'
  }

  return parseStringToJSX(text)
}
