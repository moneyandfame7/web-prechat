import {
  ApolloClient,
  ApolloLink,
  InMemoryCache,
  type NormalizedCacheObject,
  createHttpLink,
  split
} from '@apollo/client'
import {setContext} from '@apollo/client/link/context'
import {onError} from '@apollo/client/link/error'
import {GraphQLWsLink} from '@apollo/client/link/subscriptions'
import {getMainDefinition} from '@apollo/client/utilities'
import {createClient} from 'graphql-ws'
import {getGlobalState} from 'state/signal'
import {ApiAuth} from './auth'
import {ApiSettings} from './settings'

class _ApiClient {
  private readonly _client: ApolloClient<NormalizedCacheObject>
  private readonly _httpLink: ApolloLink = this.getHttpLink()
  private readonly _headersLink: ApolloLink = this.getHeadersLink()
  private readonly _errorLink: ApolloLink = this.getErrorLink()
  private readonly _wsLink: GraphQLWsLink = this.getWsLink()
  private readonly _withSubLink: ApolloLink = this.getWithSubLink(
    this._wsLink,
    this._httpLink
  )

  public readonly auth: ApiAuth
  public readonly settings: ApiSettings
  public constructor() {
    this._client = new ApolloClient({
      link: ApolloLink.from([
        this._errorLink,
        this._headersLink,
        this._withSubLink
      ]),
      cache: new InMemoryCache({})
    })
    this.auth = new ApiAuth(this._client)
    this.settings = new ApiSettings(this._client)
  }

  /** Apollo link */
  private getHttpLink() {
    return createHttpLink({
      uri: import.meta.env.VITE_API_URL
    })
  }
  /** Apollo link */
  private getHeadersLink() {
    return setContext(async (_, {headers}) => {
      const {auth, settings} = getGlobalState()

      return {
        headers: {
          ...headers,
          'prechat-language': settings.i18n.lang_code,
          'prechat-session': auth.session || '',
          'prechat-api-token': import.meta.env.VITE_API_TOKEN
        }
      }
    })
  }
  /** Apollo link */
  private getErrorLink() {
    return onError(({graphQLErrors, networkError}) => {
      if (networkError) {
        console.error(`[Network error]: ${networkError}`)
      }

      if (graphQLErrors) {
        graphQLErrors.forEach(({message}) =>
          console.error(`[GraphQL error]: Message: ${message}`)
        )
      }
    })
  }
  /** Apollo link */
  private getWsLink() {
    return new GraphQLWsLink(
      createClient({
        url: 'ws://localhost:8001/graphql/subscriptions',
        connectionParams: async () => ({
          isWebsocket: true,
          'prechat-api-token': import.meta.env.VITE_API_TOKEN
        })
      })
    )
  }
  /** Apollo link */
  private getWithSubLink(wsLink: GraphQLWsLink, httpLink: ApolloLink) {
    return split(
      ({query}) => {
        const definition = getMainDefinition(query)

        return (
          definition.kind === 'OperationDefinition' &&
          definition.operation === 'subscription'
        )
      },
      wsLink,
      httpLink
    )
  }
}

export const ApiClient = new _ApiClient()
