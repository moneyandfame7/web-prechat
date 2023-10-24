import {
  MUTATION_ADD_CONTACT,
  MUTATION_DELETE_CONTACT,
  MUTATION_UPDATE_CONTACT,
  QUERY_GET_CONTACTS,
} from 'api/graphql'
import {cleanupResponse} from 'api/helpers/cleanupResponse'
import {cleanTypename} from 'api/helpers/cleanupTypename'
import type {AddContactInput, ApiUser, UpdateContactInput} from 'api/types'

import {ApiBaseMethod} from '../base'

export class ApiContacts extends ApiBaseMethod {
  public async getContacts(): Promise<ApiUser[] | undefined> {
    const {data} = await this.client.query({
      query: QUERY_GET_CONTACTS,
      fetchPolicy: 'cache-first',
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
        input,
      },
    })
    if (!data?.addContact) {
      return undefined
    }

    return cleanTypename(data.addContact)
  }

  public async deleteContact(userId: string) {
    const {data} = await this.client.mutate({
      mutation: MUTATION_DELETE_CONTACT,
      variables: {
        userId,
      },
    })
    if (!data?.deleteContact) {
      return undefined
    }
    return cleanupResponse(data.deleteContact)
    /*  */
  }

  public async updateContact(input: UpdateContactInput) {
    const {data} = await this.client.mutate({
      mutation: MUTATION_UPDATE_CONTACT,
      variables: {
        input,
      },
    })
    return Boolean(data?.updateContact)
    /*  */
  }
}
