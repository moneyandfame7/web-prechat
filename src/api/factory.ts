import type {ApolloClientWrapper} from './apollo'
import {ApiChatFolders, ApiMedia, ApiMessages} from './methods'
import {ApiAccount} from './methods/account'
import {ApiAuth} from './methods/auth'
import {ApiChats} from './methods/chats'
import {ApiContacts} from './methods/contacts'
import {ApiLangPack} from './methods/langPack'
import {ApiSettings} from './methods/settings'
import {ApiUsers} from './methods/users'

export class ServiceFactory {
  // eslint-disable-next-line no-useless-constructor
  public constructor(public readonly apolloClient: ApolloClientWrapper) {}

  public createAuth() {
    return new ApiAuth(this.apolloClient.getClient())
  }

  public createLangPack() {
    return new ApiLangPack(this.apolloClient.getClient())
  }

  public createAccount() {
    return new ApiAccount(this.apolloClient.getClient())
  }

  public createSettings() {
    return new ApiSettings(this.apolloClient.getClient())
  }

  public createContacts() {
    return new ApiContacts(this.apolloClient.getClient())
  }

  public createUsers() {
    return new ApiUsers(this.apolloClient.getClient())
  }

  public createChats() {
    return new ApiChats(this.apolloClient.getClient())
  }

  public createMessages() {
    return new ApiMessages(this.apolloClient.getClient())
  }

  public createChatFolders() {
    return new ApiChatFolders(this.apolloClient.getClient())
  }

  public createMedia() {
    return new ApiMedia(this.apolloClient.getClient())
  }
}
