import {type DocumentNode, type TypedDocumentNode, gql} from '@apollo/client'

import type {
  ApiMessage,
  DeleteMessagesInput,
  EditMessageInput,
  GetHistoryInput,
  GetPinnedMessagesInput,
  SendMessageInput,
} from 'api/types/messages'

import {FRAGMENT_PHOTO} from './media'

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
    orderedId
    senderId
    chatId
    isOutgoing
    isPost
    editedAt
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

export const MUTATION_SEND_MESSAGE: TypedDocumentNode<
  {sendMessage: {message: ApiMessage}},
  {input: SendMessageInput}
> = gql`
  mutation SendMessage($input: SendMessageInput!) {
    sendMessage(input: $input) {
      message {
        ...AllMessageFields
      }
    }
  }

  ${FRAGMENT_MESSAGE}
`
export const MUTATION_DELETE_MESSAGES: TypedDocumentNode<
  {deleteMessages: boolean},
  {input: DeleteMessagesInput}
> = gql`
  mutation DeleteMessages($input: DeleteMessagesInput!) {
    deleteMessages(input: $input)
  }
`
export const MUTATION_EDIT_MESSAGE: TypedDocumentNode<
  {editMessage: ApiMessage},
  {input: EditMessageInput}
> = gql`
  mutation EditMessage($input: EditMessageInput!) {
    editMessage(input: $input) {
      ...AllMessageFields
    }
  }

  ${FRAGMENT_MESSAGE}
`

export const QUERY_GET_HISTORY: TypedDocumentNode<
  {getHistory: ApiMessage[]},
  {input: GetHistoryInput}
> = gql`
  query GetHistory($input: GetHistoryInput!) {
    getHistory(input: $input) {
      ...AllMessageFields
    }
  }

  ${FRAGMENT_MESSAGE}
`
export const QUERY_GET_PINNED: TypedDocumentNode<
  {getPinnedMessages: ApiMessage[]},
  {input: GetPinnedMessagesInput}
> = gql`
  query GetPinnedMessages($input: GetPinnedMessagesInput!) {
    getPinnedMessages(input: $input) {
      ...AllMessageFields
    }
  }

  ${FRAGMENT_MESSAGE}
`
export const MUTATION_SAVE_DRAFT: DocumentNode = gql`
  mutation SaveDraft($input: SaveDraftInput!) {
    saveDraft(input: $input)
  }
`

export const SUBSCRIBE_ON_DRAFT_UPDATE: DocumentNode = gql`
  subscription OnDraftUpdate {
    onDraftUpdate {
      chatId
      ownerId
      text
    }
  }
`
