import {MUTATION_CREATE_CHANNEL, MUTATION_CREATE_GROUP, QUERY_GET_CHATS} from 'api/graphql'
import {removeNull} from 'api/helpers/removeNull'
import type {CreateChannelInput, CreateGroupInput} from 'api/types'

import {cleanTypename} from 'utilities/cleanTypename'

import {ApiBaseMethod} from '../base'

export class ApiChats extends ApiBaseMethod {
  public async createChannel(input: CreateChannelInput) {
    const {data} = await this.client.mutate({
      mutation: MUTATION_CREATE_CHANNEL,
      variables: {
        input,
      },
    })

    if (!data?.createChannel) {
      return undefined
    }

    return cleanTypename(removeNull(data.createChannel))
  }

  public async createGroup(input: CreateGroupInput) {
    const {data} = await this.client.mutate({
      mutation: MUTATION_CREATE_GROUP,
      variables: {
        input,
      },
    })

    if (!data?.createGroup) {
      return undefined
    }

    return removeNull(data.createGroup)
  }

  public async getChats() {
    const {data} = await this.client.query({
      query: QUERY_GET_CHATS,
      fetchPolicy: 'cache-first',
    })

    if (!data.getChats || data.getChats.length === 0) {
      return undefined
    }

    return data.getChats.map(c => removeNull({...c}))
  }
}
