import {type TypedDocumentNode, gql} from '@apollo/client'

import {FRAGMENT_USER} from 'api/graphql'
import type {AddContactInput, ApiUser, UpdateContactInput} from 'api/types'

export const QUERY_GET_CONTACTS: TypedDocumentNode<{getContacts: ApiUser[]}, void> = gql`
  query GetContacts {
    getContacts {
      ...AllUserFields
    }
  }
  ${FRAGMENT_USER}
`

export const MUTATION_ADD_CONTACT: TypedDocumentNode<
  {addContact: ApiUser},
  {input: AddContactInput}
> = gql`
  mutation AddContact($input: AddContactInput!) {
    addContact(input: $input) {
      ...AllUserFields
    }
  }
  ${FRAGMENT_USER}
`
export const MUTATION_UPDATE_CONTACT: TypedDocumentNode<
  {updateContact: boolean},
  {input: UpdateContactInput}
> = gql`
  mutation UpdateContact($input: UpdateContactInput!) {
    updateContact(input: $input)
  }
`
export const MUTATION_DELETE_CONTACT: TypedDocumentNode<
  {deleteContact: ApiUser},
  {userId: string}
> = gql`
  mutation DeleteContactInput($userId: String!) {
    deleteContact(userId: $userId) {
      ...AllUserFields
    }
  }

  ${FRAGMENT_USER}
`
