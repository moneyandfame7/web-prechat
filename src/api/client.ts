import {ApiAuth, type ApiAuthMethods} from './services/auth'
import {Api2Fa, type ApiTwoFaMethods} from './services/2fa'
import {ApiHelp, type ApiHelpMethods} from './services/help'
import {ApiSettings, type ApiSettingsMethods} from './services/settings'

import {type ApolloClientWrapper, createApolloClientWrapper} from './apollo'

export interface ApiClientMethods {
  auth: ApiAuthMethods
  help: ApiHelpMethods
  twoFa: ApiTwoFaMethods
}

/**
 * This class is a wrapper with methods for api
 */
class ApiClient implements ApiClientMethods {
  /**
   * Constructor accepts all  instances with api methods
   */
  public constructor(
    public readonly auth: ApiAuthMethods,
    public readonly help: ApiHelpMethods,
    public readonly twoFa: ApiTwoFaMethods,
    public readonly settings: ApiSettingsMethods
  ) {}
}

function createApiClient(apolloWrapper: ApolloClientWrapper) {
  const client = apolloWrapper.getClient()

  const authService = new ApiAuth(client)
  const helpService = new ApiHelp(client)
  const settingsService = new ApiSettings(client)
  const twoFaService = new Api2Fa(client)

  const apiClient = new ApiClient(authService, helpService, twoFaService, settingsService)

  return apiClient
}

export const ApolloClient = createApolloClientWrapper()

export const api = createApiClient(ApolloClient)
