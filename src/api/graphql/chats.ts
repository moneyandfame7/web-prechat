import {type DocumentNode, type TypedDocumentNode, gql} from '@apollo/client'

import type {
  ApiChat,
  ApiChatFull,
  ApiPeer,
  CreateChannelInput,
  CreateGroupInput,
} from 'api/types/chats'
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
    draft
    photo {
      ...AllPhotoFields
    }
    inviteLink
    color
  }
  ${FRAGMENT_MESSAGE}
  ${FRAGMENT_PHOTO}
`

export const FRAGMENT_USER_PERMISSIONS: DocumentNode = gql`
  fragment AllUserPermissionsFields on ChatPermissions {
    canSendMessages
    canSendMedia
    canInviteUsers
    canPinMessages
    canChangeInfo
  }
`
export const FRAGMENT_ADMIN_PERMISSIONS: DocumentNode = gql`
  fragment AllAdminPermissionsFields on AdminPermissions {
    canChangeInfo
    canDeleteMessages
    canBanUsers
    canInviteUsers
    canPinMessages
    canAddNewAdmins
  }
`
export const FRAGMENT_CHAT_MEMBER: DocumentNode = gql`
  fragment AllChatMemberFields on ChatMember {
    userId
    inviterId
    promotedByUserId
    kickedByUserId
    userPermissions {
      ...AllUserPermissionsFields
    }
    adminPermissions {
      ...AllAdminPermissionsFields
    }
    joinedDate
    customTitle
    isAdmin
    isOwner
  }
  ${FRAGMENT_USER_PERMISSIONS}
  ${FRAGMENT_ADMIN_PERMISSIONS}
`
export const FRAGMENT_CHAT_FULL: DocumentNode = gql`
  fragment AllChatFullFields on ChatFull {
    members {
      ...AllChatMemberFields
    }
    permissions {
      ...AllUserPermissionsFields
    }
    currentUserPermissions {
      ...AllUserPermissionsFields
    }
    currentAdminPermissions {
      ...AllAdminPermissionsFields
    }
    onlineCount
    description
    areMembersHidden
    historyForNewMembers
  }
  ${FRAGMENT_CHAT_MEMBER}
  ${FRAGMENT_ADMIN_PERMISSIONS}
  ${FRAGMENT_USER_PERMISSIONS}
`

export const QUERY_GET_CHATS: TypedDocumentNode<{getChats: ApiChat[]}, void> = gql`
  query GetChats {
    getChats {
      ...AllChatFields
    }
  }
  ${FRAGMENT_CHAT}
`
export const QUERY_GET_CHAT: TypedDocumentNode<{getChat: ApiChat}, {chatId: string}> = gql`
  query GetChat {
    getChat {
      ...AllChatFields
    }
  }
  ${FRAGMENT_CHAT}
`

export const QUERY_GET_CHAT_FULL: TypedDocumentNode<
  {getChatFull: ApiChatFull},
  {chatId: string}
> = gql`
  query GetChatFull($chatId: String!) {
    getChatFull(chatId: $chatId) {
      ...AllChatFullFields
    }
  }
  ${FRAGMENT_CHAT_FULL}
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
