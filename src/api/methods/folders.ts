import {ApiBaseMethod} from 'api/base'
import {QUERY_GET_CHAT_FOLDERS} from 'api/graphql'
import {cleanupResponse} from 'api/helpers/cleanupResponse'

export class ApiChatFolders extends ApiBaseMethod {
  public async getChatFolders() {
    const {data} = await this.client.query({
      query: QUERY_GET_CHAT_FOLDERS,
    })

    return cleanupResponse(data.getChatFolders)
  }
}
