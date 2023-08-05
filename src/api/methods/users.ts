import {QUERY_GET_USERS, QUERY_GET_USER_FULL} from 'api/graphql/users'
import type {ApiInputGetUsers, ApiInputUser} from 'api/types/users'

import {cleanTypename} from 'utilities/cleanTypename'

import {ApiBaseMethod} from '../base'

export class ApiUsers extends ApiBaseMethod {
  /**
   * @param input - List of user identifiers.
   * @returns Returns basic user info according to their identifiers.
   */
  public async getUsers(input: ApiInputGetUsers) {
    const {data} = await this.client.query({
      query: QUERY_GET_USERS,
      variables: {
        input
      },
      fetchPolicy: 'cache-first'
    })
    if (!data.getUsers || data.getUsers.length === 0) {
      return undefined
    }

    return cleanTypename(data.getUsers)
  }

  /**
   *
   * @param input User ID.
   */
  public async getUserFullInfo(input: ApiInputUser) {
    const {data} = await this.client.query({
      query: QUERY_GET_USER_FULL,
      variables: {
        input
      }
    })

    if (!data.getUserFull) {
      return undefined
    }

    return data.getUserFull
  }
}
