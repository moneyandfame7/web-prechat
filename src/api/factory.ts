import {ApiSettings, type ApiSettingsMethods} from './services/settings'
import {ApiTwoFa, type ApiTwoFaMethods} from './services/2fa'
import {ApiHelp, type ApiHelpMethods} from './services/help'
import {ApiAuth, type ApiAuthMethods} from './services/auth'
import {ApiSearch, type ApiSearchMethods} from './services/search'
import {ApiContacts, type ApiContactsMethods} from './services/contacts'

import type {ApolloClientWrapper} from './apollo'
import {ApiUsers, ApiUsersMethods} from './services/users'

export class ServiceFactory {
  public constructor(public readonly apolloClient: ApolloClientWrapper) {}

  public createAuth(): ApiAuthMethods {
    return new ApiAuth(this.apolloClient.getClient())
  }

  public createHelp(): ApiHelpMethods {
    return new ApiHelp(this.apolloClient.getClient())
  }

  public createTwoFa(): ApiTwoFaMethods {
    return new ApiTwoFa(this.apolloClient.getClient())
  }

  public createSettings(): ApiSettingsMethods {
    return new ApiSettings(this.apolloClient.getClient())
  }

  public createSearch(): ApiSearchMethods {
    return new ApiSearch(this.apolloClient.getClient())
  }

  public createContacts(): ApiContactsMethods {
    return new ApiContacts(this.apolloClient.getClient())
  }

  public createUsers(): ApiUsersMethods {
    return new ApiUsers(this.apolloClient.getClient())
  }
}
