import {type TypedDocumentNode, gql} from '@apollo/client'

import type {ApiNewMessageSub} from '../types/subscriptions'
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
