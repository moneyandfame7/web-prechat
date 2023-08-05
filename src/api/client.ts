import {ServiceFactory} from './factory'

import type {ApiAuth} from './methods/auth'
import type {ApiLangPack} from './methods/langPack'
import type {ApiSettings} from './methods/settings'
import type {ApiSearch} from './methods/search'
import type {ApiContacts} from './methods/contacts'
import type {ApiUsers} from './methods/users'
import type {ApiAccount} from './methods/account'

import {type ApolloClientWrapper, createApolloClientWrapper} from './apollo'

export interface ApiMethods {
  auth: ApiAuth
  langPack: ApiLangPack
  account: ApiAccount
  settings: ApiSettings
  contacts: ApiContacts
  users: ApiUsers
}

/**
 * This class is a wrapper with methods for api
 */
class ApiClient implements ApiMethods {
  /**
   * Constructor accepts all  instances with api methods
   */
  public constructor(
    public readonly auth: ApiAuth,
    public readonly langPack: ApiLangPack,
    public readonly account: ApiAccount,
    public readonly settings: ApiSettings,
    public readonly contacts: ApiContacts,
    public readonly users: ApiUsers
  ) {}
}

function createApiClient(apolloWrapper: ApolloClientWrapper): ApiMethods {
  const factory = new ServiceFactory(apolloWrapper)

  const langPack = factory.createLangPack()
  const auth = factory.createAuth()
  const settings = factory.createSettings()
  const account = factory.createAccount()
  const contacts = factory.createContacts()
  const users = factory.createUsers()

  const apiClient = new ApiClient(auth, langPack, account, settings, contacts, users)

  return apiClient
}

export const ApolloClient = createApolloClientWrapper()

export const Api = createApiClient(ApolloClient)
