import {type TypedDocumentNode, gql} from '@apollo/client'

/**
 * Working with 2FA Login.
 */
export const QUERY_ACCOUNT_GET_PASSWORD: TypedDocumentNode<{getPassword: ''}, void> = gql`
  query GetPassword {
    getPassword {
      hint
      email
    }
  }
`
// export const MUTATION_ACCOUNT_UPDATE_PASSWORD: TypedDocumentNode<
//   {updatePassword: ''},
//   void
// > = gql``
// export const MUTATION_ACCOUNT_DISABLE_PASSWORD: TypedDocumentNode<
//   {disablePassword: ''},
//   void
// > = gql``
