import type {Query} from 'api/apollo'
import {QUERY_SEARCH_GLOBAL, QUERY_SEARCH_USERS} from 'api/graphql'

import type {
  ApiSearchGlobalInput,
  ApiSearchGlobalResponse,
  ApiSearchUsersResponse
} from 'types/api'

import {BaseService} from './base'

export interface ApiSearchMethods {
  searchGlobal: (
    input: ApiSearchGlobalInput
  ) => Query<{searchGlobal: ApiSearchGlobalResponse}>

  searchUsers: (
    input: ApiSearchGlobalInput
  ) => Query<{searchUsers: ApiSearchUsersResponse}>
}
export class ApiSearch extends BaseService implements ApiSearchMethods {
  /**
   * @returns Object with arrays of known and global chats/users.
   */
  public async searchGlobal(
    input: ApiSearchGlobalInput
  ): Query<{searchGlobal: ApiSearchGlobalResponse}> {
    return this.client.query<{searchGlobal: ApiSearchGlobalResponse}>({
      query: QUERY_SEARCH_GLOBAL,
      variables: {input},
      fetchPolicy: 'cache-first'
    })
  }

  /**
   *  @returns Object with arrays of known and global users.
   */
  public async searchUsers(
    input: ApiSearchGlobalInput
  ): Query<{searchUsers: ApiSearchUsersResponse}> {
    return this.client.query<{searchUsers: ApiSearchGlobalResponse}>({
      query: QUERY_SEARCH_USERS,
      variables: {input},
      fetchPolicy: 'cache-first'
    })
  }
}
