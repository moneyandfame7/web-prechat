import {type ApolloClientWrapper, createApolloClientWrapper} from './apollo'
import {ServiceFactory} from './factory'
import type {ApiMedia, ApiMessages} from './methods'
import type {ApiAccount} from './methods/account'
import type {ApiAuth} from './methods/auth'
import type {ApiChats} from './methods/chats'
import type {ApiContacts} from './methods/contacts'
import type {ApiLangPack} from './methods/langPack'
import type {ApiSettings} from './methods/settings'
import type {ApiUsers} from './methods/users'

export const PENDING_MAIN_REQUESTS = {
  USERS: new Set<string>(),
  CHATS: new Set<string>(),
  MESSAGES: new Set<string>(),
}
export interface ApiMethods {
  auth: ApiAuth
  langPack: ApiLangPack
  account: ApiAccount
  settings: ApiSettings
  contacts: ApiContacts
  users: ApiUsers
  chats: ApiChats
  messages: ApiMessages
  media: ApiMedia
}

/**
 * This class is a wrapper with methods for api
 */
class ApiManager implements ApiMethods {
  /**
   * Constructor accepts all  instances with api methods
   */
  // eslint-disable-next-line no-useless-constructor
  public constructor(
    public readonly auth: ApiAuth,
    public readonly langPack: ApiLangPack,
    public readonly account: ApiAccount,
    public readonly settings: ApiSettings,
    public readonly contacts: ApiContacts,
    public readonly users: ApiUsers,
    public readonly chats: ApiChats,
    public readonly messages: ApiMessages,
    public readonly media: ApiMedia
  ) {}
}

function createApiManager(apolloWrapper: ApolloClientWrapper): ApiMethods {
  const factory = new ServiceFactory(apolloWrapper)

  const langPack = factory.createLangPack()
  const auth = factory.createAuth()
  const settings = factory.createSettings()
  const account = factory.createAccount()
  const contacts = factory.createContacts()
  const users = factory.createUsers()
  const chats = factory.createChats()
  const messages = factory.createMessages()
  const media = factory.createMedia()
  const apiClient = new ApiManager(
    auth,
    langPack,
    account,
    settings,
    contacts,
    users,
    chats,
    messages,
    media
  )

  return apiClient
}

export const ApolloClient = createApolloClientWrapper()

export const Api = createApiManager(ApolloClient)
