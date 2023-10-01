import {ApiBaseMethod} from 'api/base'
import {MUTATION_SEND_MESSAGE, QUERY_GET_HISTORY} from 'api/graphql/messages'
import {cleanTypename} from 'api/helpers/cleanupTypename'
import type {GetHistoryInput, SendMessageInput} from 'api/types/messages'

// import {timeout} from 'utilities/schedulers/timeout'

export class ApiMessages extends ApiBaseMethod {
  public async sendMessage(input: SendMessageInput) {
    // return timeout(500)('').then(() => {
    //   return false
    // })
    const {data} = await this.client.mutate({
      mutation: MUTATION_SEND_MESSAGE,
      variables: {
        input: {
          ...input,
          entities: input.entities?.length ? input.entities : undefined,
        },
      },
    })
    if (!data?.sendMessage) {
      return undefined
    }

    return cleanTypename(data.sendMessage)
  }

  public async getHistory(input: GetHistoryInput) {
    const {data} = await this.client.query({
      query: QUERY_GET_HISTORY,
      variables: {
        input,
      },
      // fetchPolicy: 'cache-first',
    })

    return cleanTypename(data.getHistory)
  }

  // public async getMessages(input: GetMessagesInput) {}
}
