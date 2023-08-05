import type {ApiUser, AddContactInput} from 'api/types'
import {MUTATION_ADD_CONTACT, QUERY_GET_CONTACTS} from 'api/graphql'

import {cleanTypename} from 'utilities/cleanTypename'
import {ApiBaseMethod} from '../base'

export class ApiContacts extends ApiBaseMethod {
  public async getContacts(): Promise<ApiUser[] | undefined> {
    const {data} = await this.client.query({
      query: QUERY_GET_CONTACTS,
      fetchPolicy: 'cache-first'
    })
    if (!data.getContacts || data.getContacts.length === 0) {
      return undefined
    }

    return cleanTypename(data.getContacts)
  }

  public async addContact(input: AddContactInput) {
    const {data} = await this.client.mutate({
      mutation: MUTATION_ADD_CONTACT,
      variables: {
        input
      }
    })
    if (!data?.addContact) {
      return undefined
    }

    return cleanTypename(data.addContact)
  }

  public async deleteContact() {
    /*  */
  }

  public async updateContact() {
    /*  */
  }
}
