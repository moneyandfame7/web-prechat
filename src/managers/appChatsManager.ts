import type {ApiChat} from 'api/types'
import {AppManager} from './manager'

/* maybe create deepSignal({}) */
export class AppChatsManager extends AppManager {
  private chats: {[chatId: string]: ApiChat}

  public getChat(id: string) {
    return this.chats[id]
  }
}
