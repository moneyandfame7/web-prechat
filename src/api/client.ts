import { InMemoryCache, createHttpLink, split, ApolloClient, ApolloLink } from '@apollo/client'
import { GraphQLWsLink } from '@apollo/client/link/subscriptions'
import { getMainDefinition } from '@apollo/client/utilities'
import { createClient } from 'graphql-ws'

const cache = new InMemoryCache({})
const httpLink = createHttpLink({
  uri: import.meta.env.VITE_API_URL
})
const wsLink = new GraphQLWsLink(
  createClient({
    url: import.meta.env.VITE_API_WS_URL,
    connectionParams: async () => ({
      isWebsocket: true,
      headers: {
        // authorization: `Bearer ${await getAccessTokenPromise()}`,
      }
    })
  })
)
export const withSubLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query)
    return definition.kind === 'OperationDefinition' && definition.operation === 'subscription'
  },
  wsLink,
  httpLink
)

export const client = new ApolloClient({
  link: ApolloLink.from([withSubLink]),
  cache
})
