import {ApolloError} from '@apollo/client'

import type {ApiError} from 'api/types/diff'

export function getApiError(e: unknown) {
  if (e instanceof ApolloError) {
    return e.graphQLErrors[0] as unknown as ApiError
  }
}
