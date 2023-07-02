/* eslint-disable no-console */
import { InMemoryCache, createHttpLink, split, ApolloClient, ApolloLink } from '@apollo/client'
import { GraphQLWsLink } from '@apollo/client/link/subscriptions'
import { setContext } from '@apollo/client/link/context'
import { onError } from '@apollo/client/link/error'
import { getMainDefinition } from '@apollo/client/utilities'
import { createClient } from 'graphql-ws'

import { getGlobalState } from 'state/signal'

const cache = new InMemoryCache({})
const httpLink = createHttpLink({
  uri: import.meta.env.VITE_API_URL
})

const linkHeaders = setContext(async (_, { headers }) => {
  const { auth, settings } = getGlobalState()

  return {
    headers: {
      ...headers,
      'prechat-language': settings.i18n.lang_code,
      'prechat-session': auth.session || '',
      'prechat-api-token': import.meta.env.VITE_API_TOKEN
    }
  }
})
const linkError = onError(({ graphQLErrors, networkError }) => {
  if (networkError) {
    console.error(`[Network error]: ${networkError}`)
  }

  if (graphQLErrors) {
    graphQLErrors.forEach(({ message }) => console.error(`[GraphQL error]: Message: ${message}`))
  }
})
const wsLink = new GraphQLWsLink(
  createClient({
    url: import.meta.env.VITE_API_URL + '/subsriptions',
    connectionParams: async () => ({
      isWebsocket: true
    })
  })
)
const withSubLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query)
    return definition.kind === 'OperationDefinition' && definition.operation === 'subscription'
  },
  wsLink,
  httpLink
)

export const client = new ApolloClient({
  link: ApolloLink.from([linkError, linkHeaders, withSubLink]),
  cache
})
