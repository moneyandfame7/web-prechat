import {ApiBaseMethod} from 'api/base'
import {
  MUTATION_DELETE_MESSAGES,
  MUTATION_EDIT_MESSAGE,
  MUTATION_READ_HISTORY,
  MUTATION_SEND_MESSAGE,
  QUERY_GET_HISTORY,
  QUERY_GET_PINNED,
} from 'api/graphql/messages'
import {cleanupResponse} from 'api/helpers/cleanupResponse'
import {cleanTypename} from 'api/helpers/cleanupTypename'
import type {CustomFetchOptions} from 'api/helpers/customFetch'
import type {
  DeleteMessagesInput,
  EditMessageInput,
  GetHistoryInput,
  GetPinnedMessagesInput,
  ReadHistoryInput,
  SendMessageInput,
} from 'api/types/messages'

// import {timeout} from 'utilities/schedulers/timeout'

export class ApiMessages extends ApiBaseMethod {
  public async sendMessage(
    input: SendMessageInput,
    {
      fileUploads,
      onAbort,
      onProgress,
      onReady,
    }: {
      fileUploads?: File[]
      onProgress?: (value: number) => void
      onAbort?: VoidFunction
      onReady?: (response: any) => void
    }
  ) {
    // return timeout(500)('').then(() => {
    //   return false
    // })
    const {data} = await this.client.mutate<any, any, {fetchOptions: CustomFetchOptions}>({
      mutation: MUTATION_SEND_MESSAGE,
      variables: {
        input: {
          ...input,
          entities: input.entities?.length ? input.entities : undefined,
        },
        files: fileUploads,
      },
      context: {
        fetchOptions: {
          ...(onProgress
            ? {
                onProgress(e) {
                  const percentComplete = Math.round((e.loaded / e.total) * 100)

                  onProgress(percentComplete)
                  console.log('ON PROGRESS!!!!!!!!!! ', percentComplete)
                },
              }
            : {}),
          onAbort,
          onReady,
        },
      },
    })
    if (!data?.sendMessage?.message) {
      return undefined
    }

    return cleanTypename(data.sendMessage.message)
  }

  public async deleteMessages(input: DeleteMessagesInput) {
    const {data} = await this.client.mutate({
      mutation: MUTATION_DELETE_MESSAGES,
      variables: {input},
    })
    return Boolean(data?.deleteMessages)
  }

  public async editMessage(input: EditMessageInput) {
    const {data} = await this.client.mutate({
      mutation: MUTATION_EDIT_MESSAGE,
      variables: {input},
    })
    if (!data?.editMessage) {
      return undefined
    }

    return cleanupResponse(data.editMessage)
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

  public async readHistory(input: ReadHistoryInput) {
    const {data} = await this.client.mutate({
      mutation: MUTATION_READ_HISTORY,
      variables: {
        input,
      },
    })

    return cleanTypename(data?.readHistory.newUnreadCount)
  }

  public async getPinnedMessages(input: GetPinnedMessagesInput) {
    const {data} = await this.client.query({
      query: QUERY_GET_PINNED,
      variables: {
        input,
      },
    })

    return cleanupResponse(data.getPinnedMessages)
  }

  // public async getMessages(input: GetMessagesInput) {}
}
