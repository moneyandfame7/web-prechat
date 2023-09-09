import {type DocumentNode, type TypedDocumentNode, gql} from '@apollo/client'

import type {ApiChat, ApiPeer, CreateChannelInput, CreateGroupInput} from 'api/types/chats'
import {ResolvedPeer} from 'api/types/diff'
import type {ApiUser} from 'api/types/users'

import {FRAGMENT_MESSAGE, FRAGMENT_PHOTO} from './messages'
import {FRAGMENT_USER} from './users'

export const FRAGMENT_CHAT: DocumentNode = gql`
  fragment AllChatFields on Chat {
    id
    _id
    userId
    type
    title
    membersCount
    unreadCount
    isNotJoined
    isForbidden
    isSupport
    lastMessage {
      ...AllMessageFields
    }
    isOwner
    isPinned
    createdAt
    photo {
      ...AllPhotoFields
    }
    color
  }
  ${FRAGMENT_MESSAGE}
  ${FRAGMENT_PHOTO}
`

export const QUERY_GET_CHATS: TypedDocumentNode<{getChats: ApiChat[]}, void> = gql`
  query GetChats {
    getChats {
      ...AllChatFields
    }
  }
  ${FRAGMENT_CHAT}
`

export const QUERY_RESOLVE_USERNAME: TypedDocumentNode<
  {resolveUsername: ApiPeer},
  {username: string}
> = gql`
  query ResolveUsername($username: String!) {
    resolveUsername(username: $username) {
      ...AllChatFields
      ...AllUserFields
    }
  }
  ${FRAGMENT_CHAT}
  ${FRAGMENT_USER}
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
