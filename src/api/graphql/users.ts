import {type DocumentNode, type TypedDocumentNode, gql} from '@apollo/client'

import type {ApiInputGetUsers, ApiInputUser, ApiUser, ApiUserFull} from 'api/types/users'

export const FRAGMENT_USER: DocumentNode = gql`
  fragment AllUserFields on User {
    id
    firstName
    lastName
    phoneNumber
    username
    isSelf
    isContact
    isMutualContact
    fullInfo {
      avatar {
        avatarVariant
      }
      bio
    }
  }
`
export const QUERY_GET_USERS: TypedDocumentNode<
  {getUsers: ApiUser[]},
  {input: ApiInputGetUsers}
> = gql`
  query GetUsers($input: GetUsersInput!) {
    getUsers(input: $input) {
      ...AllUserFields
    }
  }
  ${FRAGMENT_USER}
`

export const QUERY_GET_USER_FULL: TypedDocumentNode<
  {getUserFull: ApiUserFull},
  {input: ApiInputUser}
> = gql`
  query GetUserFull($input: UserInput!) {
    getUserFull(input: $input) {
      avatar {
        avatarVariant
        hash
        url
      }
      bio
    }
  }
`
