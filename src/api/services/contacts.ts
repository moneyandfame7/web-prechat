import type {Query} from 'api/apollo'
import {QUERY_GET_CONTACTS} from 'api/graphql'

import {BaseService} from './base'

export interface ApiContactsMethods {
  getContacts: () => Query<{getContacts: string[]}>
}

export class ApiContacts extends BaseService implements ApiContactsMethods {
  public async getContacts(): Query<{getContacts: string[]}> {
    return this.client.query({
      query: QUERY_GET_CONTACTS,
      fetchPolicy: 'cache-first'
    })
  }
}
