import {type TypedDocumentNode, gql, type DocumentNode} from '@apollo/client'

import type {ApiChat, CreateChannelInput, CreateGroupInput} from 'api/types/chats'
import type {ApiUser} from 'api/types/users'

import {FRAGMENT_USER} from './users'

export const FRAGMENT_CHAT: DocumentNode = gql`
  fragment AllChatFields on Chat {
    id
    type
    title
    membersCount
    unreadCount
    isNotJoined
    isForbidden
    isSupport
    lastMessage

    createdAt
  }
`

export const QUERY_GET_CHATS: TypedDocumentNode<{getChats: ApiChat[]}, void> = gql`
  query GetChats {
    getChats {
      ...AllChatFields
    }
  }
  ${FRAGMENT_CHAT}
`

export const MUTATION_CREATE_CHANNEL: TypedDocumentNode<
  {createChannel: ApiChat},
  {input: CreateChannelInput}
> = gql`
  mutation CreateChannel($input: CreateChannelInput!) {
    createChannel(input: $input) {
      ...AllChatFields
    }
  }
  ${FRAGMENT_CHAT}
`
export const MUTATION_CREATE_GROUP: TypedDocumentNode<
  {createGroup: ApiChat},
  {input: CreateGroupInput}
> = gql`
  mutation CreateGroup($input: CreateGroupInput!) {
    createGroup(input: $input) {
      ...AllChatFields
    }
  }
  ${FRAGMENT_CHAT}
`

export const SUBSCRIBE_ON_CHAT_CREATED: TypedDocumentNode<{
  onChatCreated: {
    users: ApiUser[]
    chat: ApiChat
  }
}> = gql`
  subscription OnChatCreated {
    onChatCreated {
      users {
        ...AllUserFields
      }
      chat {
        ...AllChatFields
      }
    }
  }

  ${FRAGMENT_CHAT}
  ${FRAGMENT_USER}
`
