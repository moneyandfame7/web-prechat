import {
  type NormalizedCacheObject,
  ApolloClient,
  ApolloLink,
  InMemoryCache,
  createHttpLink,
  split,
  type FetchResult,
  type ApolloQueryResult
} from '@apollo/client'
import {setContext} from '@apollo/client/link/context'
import {onError} from '@apollo/client/link/error'
import {GraphQLWsLink} from '@apollo/client/link/subscriptions'
import {type Observable, getMainDefinition} from '@apollo/client/utilities'
import {createClient} from 'graphql-ws'

import {getGlobalState} from 'state/signal'
import type {ApiClientConnection} from 'types/api'
import {ClientError} from 'lib/error/error'

export type Mutation<T> = Promise<FetchResult<T>>

export type Query<T> = Promise<ApolloQueryResult<T>>

export type Subscribe<T> = Promise<Observable<FetchResult<T>>>

/**
 * Simple apollo wraper with apollo links and error handling
 */
export class ApolloClientWrapper {
  protected readonly _client: ApolloClient<NormalizedCacheObject>

  private readonly _wsLink: GraphQLWsLink

  private readonly _httpLink: ApolloLink
  private readonly _headersLink: ApolloLink
  private readonly _splittedLinks: ApolloLink
  private readonly _errorLink: ApolloLink = this.getErrorLink()

  public constructor(connection: ApiClientConnection) {
    const {apiToken, httpUrl, wsUrl} = connection
    if (!apiToken) {
      ClientError.setError('Api token not provided')
    }

    this._headersLink = this.getHeadersLink(apiToken)
    this._httpLink = this.getHttpLink(httpUrl)
    this._wsLink = this.getWsLink(wsUrl)
    this._splittedLinks = this.getSplittedLinks(this._wsLink, this._httpLink)

    this._client = new ApolloClient({
      link: ApolloLink.from([this._errorLink, this._headersLink, this._splittedLinks]),
      cache: new InMemoryCache({})
    })
  }

  public getClient(): ApolloClient<NormalizedCacheObject> {
    return this._client
  }

  /**
   * {@link https://www.apollographql.com/docs/react/api/link/introduction/ Apollo Link}
   */
  private getHttpLink(uri: string) {
    return createHttpLink({
      uri
      /* headers?? */
    })
  }
  /**
   * {@link https://www.apollographql.com/docs/react/networking/authentication/#header Apollo Header link}
   */
  private getHeadersLink(apiToken: string) {
    return setContext(async (_, {headers}) => {
      const {auth, settings} = getGlobalState()

      return {
        headers: {
          ...headers,
          'prechat-language': settings.i18n.lang_code,
          'prechat-session': auth.session || '',
          'prechat-api-token': apiToken || ''
        }
      }
    })
  }
  /**
   * {@link https://www.apollographql.com/docs/react/api/link/apollo-link-error/ Apollo Error Link}
   */
  private getErrorLink() {
    return onError(({graphQLErrors, networkError}) => {
      if (networkError) {
        // eslint-disable-next-line no-console
        console.error(`[Network error]: ${networkError}`)
      }

      if (graphQLErrors) {
        graphQLErrors.forEach(({message}) =>
          // eslint-disable-next-line no-console
          console.error(`[GraphQL error]: Message: ${message}`)
        )
      }
    })
  }
  /**
   * {@link https://www.apollographql.com/docs/react/data/subscriptions/#2-initialize-a-graphqlwslink Graphql WebSocket Link}
   */
  private getWsLink(url: string) {
    return new GraphQLWsLink(
      createClient({
        url,
        connectionParams: async () => ({
          isWebsocket: true,
          'prechat-api-token': import.meta.env.VITE_API_TOKEN
        })
      })
    )
  }
  /**
   * {@link https://www.apollographql.com/docs/react/data/subscriptions/#3-split-communication-by-operation-recommended Split communication by operation}
   */
  private getSplittedLinks(wsLink: GraphQLWsLink, httpLink: ApolloLink) {
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

/**
 * @returns instanceof {@link ApolloClientWrapper}
 */
export function createApolloClientWrapper() {
  const client = new ApolloClientWrapper({
    apiToken: import.meta.env.VITE_API_TOKEN,
    httpUrl: import.meta.env.VITE_API_URL,
    wsUrl: 'ws://localhost:8001/graphql/subscriptions'
  })

  return client
}
