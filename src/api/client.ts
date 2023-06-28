import { InMemoryCache, createHttpLink, split, ApolloClient, ApolloLink } from '@apollo/client'
import { GraphQLWsLink } from '@apollo/client/link/subscriptions'
import { setContext } from '@apollo/client/link/context'
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
      'prechat-session': auth.session || ''
    }
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
  link: ApolloLink.from([linkHeaders, withSubLink]),
  cache
})
