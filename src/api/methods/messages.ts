import {ApiBaseMethod} from 'api/base'
import {MUTATION_SEND_MESSAGE} from 'api/graphql/messages'
import {cleanTypename} from 'api/helpers/cleanupTypename'
import type {SendMessageInput} from 'api/types/messages'

export class ApiMessages extends ApiBaseMethod {
  public async sendMessage(input: SendMessageInput) {
    const {data} = await this.client.mutate({
      mutation: MUTATION_SEND_MESSAGE,
      variables: {
        input,
      },
    })
    if (!data?.sendMessage) {
      return undefined
    }

    return cleanTypename(data.sendMessage)
  }

  // public async getMessages(input: GetMessagesInput) {}
}
