import {type DocumentNode, type TypedDocumentNode, gql} from '@apollo/client'

import type {ApiSession, ApiUserStatus, ApiUserStatusSub} from 'api/types'

export const FRAGMENT_SESSION: DocumentNode = gql`
  fragment AllSessionFields on Session {
    id
    ip
    region
    country
    createdAt
    activeAt
    browser
    platform
    userId
    isCurrent
  }
`
/**
 * Working with 2FA Login.
 */
export const QUERY_ACCOUNT_GET_PASSWORD: TypedDocumentNode<{getPassword: ''}, void> = gql`
  query GetPassword {
    getPassword {
      hint
      email
      hasRecovery
    }
  }
`

export const QUERY_ACCOUNT_GET_AUTHORIZATIONS: TypedDocumentNode<
  {getAuthorizations: ApiSession[]},
  void
> = gql`
  query GetAuthorizations {
    getAuthorizations {
      ...AllSessionFields
    }
  }
  ${FRAGMENT_SESSION}
`

export const MUTATION_TERMINATE_AUTHORIZATION: TypedDocumentNode<
  {terminateAuthorization: boolean},
  {id: string}
> = gql`
  mutation TerminateAuthorization($id: String!) {
    terminateAuthorization(id: $id)
  }
`
export const MUTATION_TERMINATE_ALL_AUTHORIZATIONS: TypedDocumentNode<
  {terminateAllAuthorizations: boolean},
  void
> = gql`
  mutation TerminateAllAuthorizations {
    terminateAllAuthorizations
  }
`

export const MUTATION_UPDATE_AUTHORIZATION_ACTIVITY: TypedDocumentNode<
  {updateAuthorizationActivity: ApiSession},
  void
> = gql`
  mutation UpdateAuthorizationActivity {
    updateAuthorizationActivity {
      ...AllSessionFields
    }
  }
  ${FRAGMENT_SESSION}
`

export const MUTATION_ACCOUNT_UPDATE_USER_STATUS: TypedDocumentNode<
  {updateUserStatus: ApiUserStatus},
  {online: boolean}
> = gql`
  mutation UpdateUserStatus($online: Boolean!) {
    updateUserStatus(online: $online)
  }
`

export const SUBSCRIBE_ON_AUTHORIZATION_CREATED: TypedDocumentNode<
  {onAuthorizationCreated: ApiSession},
  void
> = gql`
  subscription OnAuthorizationCreated {
    onAuthorizationCreated {
      ...AllSessionFields
    }
  }
  ${FRAGMENT_SESSION}
`
export const SUBSCRIBE_ON_AUTHORIZATION_UPDATED: TypedDocumentNode<
  {onAuthorizationUpdated: ApiSession},
  void
> = gql`
  subscription OnAuthorizationUpdated {
    onAuthorizationUpdated {
      ...AllSessionFields
    }
  }
  ${FRAGMENT_SESSION}
`
export const SUBSCRIBE_ON_AUTHORIZATION_TERMINATED: TypedDocumentNode<
  {onAuthorizationTerminated: ApiSession[]},
  void
> = gql`
  subscription OnAuthorizationTerminated {
    onAuthorizationTerminated {
      ...AllSessionFields
    }
  }

  ${FRAGMENT_SESSION}
`

export const SUBSCRIBE_ON_USER_STATUS_UPDATED: TypedDocumentNode<
  {onUserStatusUpdated: ApiUserStatusSub},
  void
> = gql`
  subscription OnUserStatusUpdated {
    onUserStatusUpdated {
      userId
      status
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
