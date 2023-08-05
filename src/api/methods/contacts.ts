import type {Query} from 'api/apollo'
import {QUERY_GET_CONTACTS} from 'api/graphql'

import {ApiBaseMethod} from './base'

export class ApiContacts extends ApiBaseMethod {
  public async getContacts(): Query<{getContacts: string[]}> {
    return this.client.query({
      query: QUERY_GET_CONTACTS,
      fetchPolicy: 'cache-first'
    })
  }

  public async addContact() {
    /*  */
  }

  public async deleteContact() {
    /*  */
  }

  public async updateContact() {
    /*  */
  }
}
