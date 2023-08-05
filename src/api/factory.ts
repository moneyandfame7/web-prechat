import {ApiAccount} from './methods/account'
import {ApiSettings} from './methods/settings'
import {ApiAuth} from './methods/auth'
import {ApiContacts} from './methods/contacts'
import {ApiUsers} from './methods/users'
import {ApiLangPack} from './methods/langPack'

import type {ApolloClientWrapper} from './apollo'
import {ApiChats} from './methods/chats'

export class ServiceFactory {
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
}
