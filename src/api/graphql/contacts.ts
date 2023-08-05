import {type TypedDocumentNode, gql} from '@apollo/client'

import {FRAGMENT_USER} from 'api/graphql'
import type {AddContactInput, ApiUser} from 'api/types'

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
