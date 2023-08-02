import {ServiceFactory} from './factory'

import {type ApolloClientWrapper, createApolloClientWrapper} from './apollo'

import type {ApiHelpMethods} from './services/help'
import type {ApiAuthMethods} from './services/auth'
import type {ApiTwoFaMethods} from './services/2fa'
import type {ApiSettingsMethods} from './services/settings'
import type {ApiSearchMethods} from './services/search'
import type {ApiContactsMethods} from './services/contacts'
import type {ApiUsersMethods} from './services/users'

export interface ApiMethods {
  auth: ApiAuthMethods
  help: ApiHelpMethods
  twoFa: ApiTwoFaMethods
  settings: ApiSettingsMethods
  search: ApiSearchMethods
  contacts: ApiContactsMethods
  users: ApiUsersMethods
}

/**
 * This class is a wrapper with methods for api
 */
class ApiClient implements ApiMethods {
  /**
   * Constructor accepts all  instances with api methods
   */
  public constructor(
    public readonly auth: ApiAuthMethods,
    public readonly help: ApiHelpMethods,
    public readonly twoFa: ApiTwoFaMethods,
    public readonly settings: ApiSettingsMethods,
    public readonly search: ApiSearchMethods,
    public readonly contacts: ApiContactsMethods,
    public readonly users: ApiUsersMethods
  ) {}
}

function createApiClient(apolloWrapper: ApolloClientWrapper): ApiMethods {
  const factory = new ServiceFactory(apolloWrapper)

  const authService: ApiAuthMethods = factory.createAuth()
  const helpService: ApiHelpMethods = factory.createHelp()
  const settingsService: ApiSettingsMethods = factory.createSettings()
  const twoFaService: ApiTwoFaMethods = factory.createTwoFa()
  const searchService: ApiSearchMethods = factory.createSearch()
  const contactsService: ApiContactsMethods = factory.createContacts()
  const usersService: ApiUsersMethods = factory.createUsers()

  const apiClient = new ApiClient(
    authService,
    helpService,
    twoFaService,
    settingsService,
    searchService,
    contactsService,
    usersService
  )

  return apiClient
}

export const ApolloClient = createApolloClientWrapper()

export const Api = createApiClient(ApolloClient)

// +12345678 eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjhkMjA5N2M4LWE1ZTQtNDcxYS04N2E4LWZmODJhYjM0ZjhkZCIsInVzZXJJZCI6IjU1OGNmMWRhLTJhNjktNDA4ZC04ZGRiLWZmNTYzZGI1ZTJiZCIsImlhdCI6MTY5MDk3OTI2NH0.jerLVi3aW8Qznbhmj33LBYkp_2A_JvC6RrbsYY3GNXI
// +38068 eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjkwMGFlOGU4LWI3YjMtNGI4ZS1iYTQ4LTEzN2ZjZDk1ZWYyNyIsInVzZXJJZCI6IjJjMmQ2Y2RiLTMxNDQtNDU2Zi05NzVjLTliMDcxZGY0MmUxMSIsImlhdCI6MTY5MDk3MDAzNn0.pacEaGK31y_pcUDN2YY6V-5Rzvhk6H7pmw_0bNqZ7ZU
