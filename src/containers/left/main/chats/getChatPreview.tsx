import type {ApiChat, ApiUser} from 'api/types'

import {getMessageActionText} from 'state/helpers/messages'

import {renderText} from 'utilities/parse/render'

export function getChatPreview(chat: ApiChat, sender?: ApiUser) {
  const {lastMessage} = chat
  let text: string

  if (chat.draft) {
    return (
      <>
        <b>Draft: </b>
        {chat.draft}
      </>
    )
  }
  if (lastMessage?.action) {
    text = getMessageActionText(lastMessage.action, sender)
  } else {
    text = lastMessage?.text || 'EMPTY_MESSAGE'
  }

  return renderText(text, ['emoji', 'markdown'])
}
