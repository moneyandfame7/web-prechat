import {type DocumentNode, type TypedDocumentNode, gql} from '@apollo/client'

import type {ApiInputGetUsers, ApiUser} from 'api/types/users'

import {FRAGMENT_PHOTO} from './media'

export const FRAGMENT_USER_STATUS: DocumentNode = gql`
  fragment AllUserStatusFields on UserStatus {
    type
    wasOnline
  }
`
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
    status {
      ...AllUserStatusFields
    }
    color
    photo {
      ...AllPhotoFields
    }
  }
  ${FRAGMENT_USER_STATUS}
  ${FRAGMENT_PHOTO}
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
