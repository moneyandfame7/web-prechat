import {QUERY_GET_USERS} from 'api/graphql/users'
import type {ApiInputGetUsers} from 'api/types/users'

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
        input,
      },
      fetchPolicy: 'cache-first',
    })
    if (!data.getUsers || data.getUsers.length === 0) {
      return undefined
    }

    return cleanTypename(data.getUsers)
  }
}
