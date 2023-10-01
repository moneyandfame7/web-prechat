import {
  MUTATION_CREATE_CHANNEL,
  MUTATION_CREATE_GROUP,
  QUERY_GET_CHAT,
  QUERY_GET_CHATS,
  QUERY_GET_CHAT_FULL,
  QUERY_RESOLVE_USERNAME,
} from 'api/graphql'
import {cleanTypename} from 'api/helpers/cleanupTypename'
import type {CreateChannelInput, CreateGroupInput} from 'api/types'

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

    return cleanTypename(data.createChannel)
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

    return cleanTypename(data.createGroup)
  }

  public async getChats() {
    const {data} = await this.client.query({
      query: QUERY_GET_CHATS,
      fetchPolicy: 'cache-first',
    })

    return cleanTypename(data.getChats)
  }

  public async getChat(chatId: string) {
    const {data} = await this.client.query({
      query: QUERY_GET_CHAT,
      fetchPolicy: 'cache-first',
      variables: {
        chatId,
      },
    })

    if (!data.getChat) {
      return undefined
    }

    return cleanTypename(data.getChat)
  }

  public async getChatFull(chatId: string) {
    const {data} = await this.client.query({
      query: QUERY_GET_CHAT_FULL,
      fetchPolicy: 'cache-first',
      variables: {
        chatId,
      },
    })
    return data.getChatFull
  }

  public async resolveUsername(username: string) {
    const {data} = await this.client.query({
      query: QUERY_RESOLVE_USERNAME,
      fetchPolicy: 'cache-first',
      variables: {
        username,
      },
    })

    if (!data.resolveUsername) {
      return undefined
    }

    return cleanTypename(data.resolveUsername)
  }
}
