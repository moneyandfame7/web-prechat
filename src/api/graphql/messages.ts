import {type DocumentNode, type TypedDocumentNode, gql} from '@apollo/client'

import type {ApiMessage, GetHistoryInput, SendMessageInput} from 'api/types/messages'

export const FRAGMENT_PHOTO: DocumentNode = gql`
  fragment AllPhotoFields on Photo {
    id
    date
    blurHash
    url
  }
`
export const FRAGMENT_MESSAGE_ACTION: DocumentNode = gql`
  fragment AllMessageActionFields on MessageAction {
    text
    type
    users
    photo {
      ...AllPhotoFields
    }
    values
  }
  ${FRAGMENT_PHOTO}
`
export const FRAGMENT_MESSAGE: DocumentNode = gql`
  fragment AllMessageFields on Message {
    id
    senderId
    chatId
    isOutgoing
    isPost
    media {
      __typename
    }
    action {
      ...AllMessageActionFields
    }
    content {
      formattedText {
        text
        entities {
          start
          end
          type
        }
      }
      action {
        ...AllMessageActionFields
      }
    }
    text
    createdAt
    updatedAt
    postAuthor
    views
  }
  ${FRAGMENT_MESSAGE_ACTION}
`

export const MUTATION_SEND_MESSAGE: TypedDocumentNode<{
  sendMessage: {message: ApiMessage}
  input: SendMessageInput
}> = gql`
  mutation SendMessage($input: SendMessageInput!) {
    sendMessage(input: $input) {
      message {
        ...AllMessageFields
      }
    }
  }

  ${FRAGMENT_MESSAGE}
`

export const QUERY_GET_HISTORY: TypedDocumentNode<{
  getHistory: ApiMessage[]
  input: GetHistoryInput
}> = gql`
  query GetHistory($input: GetHistoryInput!) {
    getHistory(input: $input) {
      ...AllMessageFields
    }
  }

  ${FRAGMENT_MESSAGE}
`
