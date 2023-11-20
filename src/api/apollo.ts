import {
  ApolloClient,
  type ApolloError,
  ApolloLink,
  InMemoryCache,
  type NormalizedCacheObject,
  split,
} from '@apollo/client'
import {setContext} from '@apollo/client/link/context'
import {onError} from '@apollo/client/link/error'
import {RetryLink} from '@apollo/client/link/retry'
import {GraphQLWsLink} from '@apollo/client/link/subscriptions'
import {getMainDefinition} from '@apollo/client/utilities'

import {createUploadLink} from 'apollo-upload-client'
import {createClient} from 'graphql-ws'

import {getActions} from 'state/action'
import {getGlobalState} from 'state/signal'

import {DEBUG} from 'common/environment'

import {customFetch} from './helpers/customFetch'
import type {ApiError} from './types/diff'

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
        this._retryLink,
        this._errorLink,
        this._headersLink,
        this._splittedLinks,
      ]),
      cache: new InMemoryCache(),
    })
  }

  public getClient(): ApolloClient<NormalizedCacheObject> {
    return this.client
  }

  /**
   * {@link https://www.apollographql.com/docs/react/api/link/introduction/ Apollo Link}
   */
  private getHttpLink(uri: string) {
    return createUploadLink({
      uri,
      headers: {
        'apollo-require-preflight': 'true',
      },

      fetch: customFetch as any,
      /* headers?? */
    }) as unknown as ApolloLink
    // return createUploadLink({
    //   uri,
    //   fetch: customFetch2 as any,

    // })
  }

  /**
   * {@link https://www.apollographql.com/docs/react/networking/authentication/#header Apollo Header link}
   */
  private getHeadersLink() {
    return setContext(async (_, {headers}) => {
      const {
        auth,
        settings: {i18n},
      } = getGlobalState()

      return {
        headers: {
          ...headers,
          'prechat-language': i18n.lang_code,
          'prechat-session': auth.session,
        },
      }
    })
  }
  /**
   * {@link https://www.apollographql.com/docs/react/api/link/apollo-link-error/ Apollo Error Link}
   */
  private getErrorLink() {
    const actions = getActions()
    return onError(({graphQLErrors, networkError}) => {
      if (networkError) {
        // eslint-disable-next-line no-console
        console.error(`[Network error]: ${networkError}`)
      }

      if (graphQLErrors) {
        graphQLErrors.forEach((error) => {
          const apiError = error as unknown as ApiError | undefined

          switch (apiError?.code) {
            case 'AUTH_SESSION_INVALID':
            case 'AUTH_SESSION_EXPIRED':
              actions.reset()
          }
          // eslint-disable-next-line no-console
          // console.error(`[GraphQL error]: Message: ${message}`, path)
        })
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
            'prechat-session': auth.session || '',
          },
        }),
        shouldRetry: (/* err */) => {
          return false
        },
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
          definition.kind === 'OperationDefinition' && definition.operation === 'subscription'
        )
      },
      wsLink,
      httpLink
    )
  }

  private getRetryLink() {
    return new RetryLink({
      attempts: {
        retryIf: (error: ApolloError) => {
          return error.message === 'Failed to fetch'
        },
        max: Infinity,
      },
      delay: (/* operation, error */) => {
        return 7000
      },
    })
  }
}

/**
 * @returns instanceof {@link ApolloClientWrapper}
 */
export function createApolloClientWrapper(): ApolloClientWrapper {
  const httpUrl = import.meta.env.VITE_API_URL
  // eslint-disable-next-line prefer-template
  const wsUrl =
    httpUrl.replace(DEBUG ? 'http://' : 'https://', DEBUG ? 'ws://' : 'wss://') +
    '/subscriptions'

  const client = new ApolloClientWrapper({
    httpUrl,
    wsUrl,
  })
  // client.client.
  return client
}
