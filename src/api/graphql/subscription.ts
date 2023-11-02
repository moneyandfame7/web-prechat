import {type TypedDocumentNode, gql} from '@apollo/client'

import type {
  ApiDeleteMessagesSub,
  ApiEditMessageSub,
  ApiNewMessageSub,
} from '../types/subscriptions'
import {FRAGMENT_CHAT} from './chats'
import {FRAGMENT_MESSAGE} from './messages'

export const SUBSCRIBE_ON_NEW_MESSAGE: TypedDocumentNode<
  {onNewMessage: ApiNewMessageSub},
  void
> = gql`
  subscription OnNewMessage {
    onNewMessage {
      chat {
        ...AllChatFields
      }
      message {
        ...AllMessageFields
      }
    }
  }
  ${FRAGMENT_CHAT}
  ${FRAGMENT_MESSAGE}
`

export const SUBSCRIBE_ON_DELETE_MESSAGES: TypedDocumentNode<
  {onDeleteMessages: ApiDeleteMessagesSub},
  void
> = gql`
  subscription OnDeleteMessages {
    onDeleteMessages {
      chat {
        ...AllChatFields
      }
      ids
    }
  }
  ${FRAGMENT_CHAT}
`
export const SUBSCRIBE_ON_EDIT_MESSAGE: TypedDocumentNode<
  {onEditMessage: ApiEditMessageSub},
  void
> = gql`
  subscription OnEditMessage {
    onEditMessage {
      message {
        ...AllMessageFields
      }
    }
  }
  ${FRAGMENT_MESSAGE}
`
