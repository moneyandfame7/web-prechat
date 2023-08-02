import {BaseService} from './base'

export interface ApiChatsMethods {
  createChannel: () => void
}
export class ApiChats extends BaseService implements ApiChatsMethods {
  public async createChannel() {}

  public async createGroup() {}
}
