import {
  type NormalizedCacheObject,
  ApolloClient,
  ApolloLink,
  InMemoryCache,
  createHttpLink,
  split,
  ApolloError
} from '@apollo/client'
import {RetryLink} from '@apollo/client/link/retry'
import {setContext} from '@apollo/client/link/context'
import {onError} from '@apollo/client/link/error'
import {GraphQLWsLink} from '@apollo/client/link/subscriptions'
import {getMainDefinition} from '@apollo/client/utilities'
import {createClient} from 'graphql-ws'

import {getGlobalState} from 'state/signal'
import {logDebugWarn} from 'lib/logger'

export type GqlDoc = {
  __typename: string
}

/**
 * Simple apollo wraper with apollo links and error handling
 */
export class ApolloClientWrapper {
  public readonly client: ApolloClient<NormalizedCacheObject>

  private readonly _wsLink: GraphQLWsLink

  private readonly _httpLink: ApolloLink
  private readonly _headersLink: ApolloLink
  private readonly _splittedLinks: ApolloLink
  private readonly _errorLink: ApolloLink = this.getErrorLink()
  private readonly _retryLink: ApolloLink = this.getRetryLink()
  public constructor(connection: {httpUrl: string; wsUrl: string}) {
    const {httpUrl, wsUrl} = connection

    this._headersLink = this.getHeadersLink()
    this._httpLink = this.getHttpLink(httpUrl)
    this._wsLink = this.getWsLink(wsUrl)
    this._splittedLinks = this.getSplittedLinks(this._wsLink, this._httpLink)
    this.client = new ApolloClient({
      link: ApolloLink.from([
        // this._retryLink,
        this._errorLink,
        this._headersLink,
        this._splittedLinks
      ]),
      cache: new InMemoryCache()
    })
  }

  public getClient(): ApolloClient<NormalizedCacheObject> {
    return this.client
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
  private getHeadersLink() {
    return setContext(async (_, {headers}) => {
      const {auth, settings} = getGlobalState()

      return {
        headers: {
          ...headers,
          'prechat-language': settings.i18n.lang_code,
          'prechat-session': auth.session || ''
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
    const {auth} = getGlobalState()

    return new GraphQLWsLink(
      createClient({
        url,
        connectionParams: async () => ({
          isWebsocket: true,
          headers: {
            'prechat-session': auth.session || ''
          }
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

  private getRetryLink() {
    return new RetryLink({
      attempts: {
        max: 3,
        retryIf: (error: ApolloError) => {
          return error.message === 'Failed to fetch'
        }
      },
      delay: (count /* operation, error */) => {
        return count * 5000 * Math.random()
      }
    })
  }
}

/**
 * @returns instanceof {@link ApolloClientWrapper}
 */
export function createApolloClientWrapper(): ApolloClientWrapper {
  const client = new ApolloClientWrapper({
    httpUrl: import.meta.env.VITE_API_URL,
    wsUrl: 'ws://localhost:8001/graphql/subscriptions'
  })

  return client
}

/**
 * Just format if it's instance of ApolloError and log error, otherwise just log error
 */
export function handleApolloError(e: unknown) {
  if (e instanceof ApolloError) {
    const error = {
      message: e.message,
      stack: e.stack,
      name: e.name
    }

    logDebugWarn(error)
  } else {
    logDebugWarn(e)
  }
}
