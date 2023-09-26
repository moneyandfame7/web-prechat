import {ApiDraft, ApiMessage, ApiUser} from 'api/types'

import {getMessageActionText} from 'state/helpers/messages'

import {renderText} from 'utilities/parse/render'

export function getMessageText(message?: ApiMessage, sender?: ApiUser, draft?: ApiDraft) {
  let text: string
  if (message?.action) {
    text = getMessageActionText(message.action, sender)
  } else {
    text = message?.text || 'EMPTY_MESSAGE'
  }

  if (draft) {
    return (
      <>
        <b>Draft: </b>
        {draft.formattedText.text}
      </>
    )
  }

  return renderText(text, ['emoji', 'markdown'])
}
