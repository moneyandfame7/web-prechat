import {type TypedDocumentNode, gql} from '@apollo/client'

import {FRAGMENT_CHAT, FRAGMENT_USER} from 'api/graphql'
import type {AddContactInput, AddContactResponse, ApiUser} from 'api/types'

export const QUERY_GET_CONTACTS: TypedDocumentNode<{getContacts: ApiUser[]}, void> = gql`
  query GetContacts {
    getContacts {
      ...AllUserFields
    }
  }
  ${FRAGMENT_USER}
`

export const MUTATION_ADD_CONTACT: TypedDocumentNode<
  {addContact: AddContactResponse},
  {input: AddContactInput}
> = gql`
  mutation AddContact($input: AddContactInput!) {
    addContact(input: $input) {
      user {
        ...AllUserFields
      }
      chat {
        ...AllChatFields
      }
    }
  }
  ${FRAGMENT_USER}
  ${FRAGMENT_CHAT}
`
