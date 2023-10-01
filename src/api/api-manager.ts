import {
  type ApolloClient,
  type ApolloQueryResult,
  type FetchResult,
  type NormalizedCacheObject,
  type TypedDocumentNode,
} from '@apollo/client'

import type {Split} from 'types/common'

import {
  MUTATION_CREATE_CHANNEL,
  MUTATION_CREATE_GROUP,
  QUERY_GET_CHAT,
  QUERY_GET_CHATS,
  QUERY_GET_CHAT_FULL,
  QUERY_GET_USERS,
} from './graphql'
import {MUTATION_SAVE_DRAFT} from './graphql/messages'
import {cleanTypename} from './helpers/cleanupTypename'
import {removeNull} from './helpers/removeNull'
import {ApolloClient as ApolloManager} from './manager'
import type {
  ApiChat,
  ApiChatFull,
  ApiInputChat,
  ApiInputGetUsers,
  ApiInputSaveDraft,
  ApiUser,
  CreateChannelInput,
  CreateGroupInput,
} from './types'

export interface MethodsMap {
  'chats.getChat': {variables: ApiInputChat; res: ApiChat}
  'chats.getChatFull': {variables: ApiInputChat; res: ApiChatFull}
  'chats.getChats': {variables: never; res: ApiChat[]}
  'chats.createChannel': {variables: {input: CreateChannelInput}; res: ApiChat}
  'chats.createGroup': {variables: {input: CreateGroupInput}; res: ApiChat}

  /* USERS */
  'users.getUsers': {variables: {input: ApiInputGetUsers}; res: ApiUser[]}

  /* MESSAGES */
  'messages.saveDraft': {variables: {input: ApiInputSaveDraft}; res?: true}

  /* FOLDERS */
}

// export type GqlOptions = {
//   [K in keyof MethodsMap]: TypedDocumentNode<
//     {[key in Split<K>]: MethodsMap[K]['res']},
//     MethodsMap[K]['variables']
//   >
// }

type InvokeApiOptions = {
  [K in keyof MethodsMap]: {
    operation: Operation
    gql: TypedDocumentNode<
      {[key in Split<K>]: MethodsMap[K]['res']},
      MethodsMap[K]['variables']
    >
  }
}
const INVOKE_API_OPTIONS: InvokeApiOptions = {
  'chats.getChat': {
    operation: 'query',
    gql: QUERY_GET_CHAT,
  },
  'chats.getChats': {
    operation: 'query',
    gql: QUERY_GET_CHATS,
  },
  'chats.createChannel': {
    operation: 'mutate',
    gql: MUTATION_CREATE_CHANNEL,
  },
  'chats.createGroup': {
    operation: 'mutate',
    gql: MUTATION_CREATE_GROUP,
  },
  'chats.getChatFull': {
    operation: 'query',
    gql: QUERY_GET_CHAT_FULL,
  },

  'users.getUsers': {
    operation: 'query',
    gql: QUERY_GET_USERS,
  },

  /* Messages */
  'messages.saveDraft': {
    operation: 'mutate',
    gql: MUTATION_SAVE_DRAFT,
  },
}

export type Operation = 'query' | 'mutate'
type InvokeApi<T extends keyof MethodsMap> = MethodsMap[T]['variables'] extends never
  ? {method: T}
  : {method: T; variables: MethodsMap[T]['variables']}

export class ApiManager {
  // eslint-disable-next-line no-useless-constructor
  public constructor(protected client: ApolloClient<NormalizedCacheObject>) {}

  public async invokeApi<T extends keyof MethodsMap>(test: InvokeApi<T>) {
    const variables = 'variables' in test ? test.variables : undefined
    const operation = INVOKE_API_OPTIONS[test.method]['operation']

    return this.getOperation(test.method, operation, variables as MethodsMap[T]['variables'])
  }

  private async getOperation<M extends keyof MethodsMap, O extends Operation>(
    method: M,
    operation: O,
    variables: MethodsMap[M]['variables']
  ): Promise<MethodsMap[M]['res'] | undefined> {
    const {gql} = INVOKE_API_OPTIONS[method]
    const splitted = method.split('.')[1] as Split<M>
    if (!splitted || !gql) {
      throw new Error('invalid method name')
    }
    switch (operation) {
      case 'mutate': {
        const result = await this.client.mutate({
          mutation: gql,
          variables,
        })

        return this.resolveResponse(result, splitted)
      }
      case 'query': {
        const result = await this.client.query({
          query: gql,
          variables,
          fetchPolicy: 'cache-first',
        })

        return this.resolveResponse(result, splitted)
      }
      default:
        throw new Error('invalid operation name')
    }
  }

  private resolveResponse<M extends keyof MethodsMap, TData extends MethodsMap[M]['res']>(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    result: ApolloQueryResult<any> | FetchResult<any>,
    splitted: Split<M>
  ) {
    if ('error' in result && result.error) {
      // eslint-disable-next-line no-console
      console.error('RESOLVE_error:', result.error)
      // logger.error(result.error)
      return undefined
    }
    if (result.errors) {
      // eslint-disable-next-line no-console
      console.error('RESOLVE_errors:', result.errors)
      return undefined
    }
    const nestedObj = result?.data?.[splitted as keyof typeof result.data] as TData
    // const nestedObj = result.data?.[splitted as keyof typeof data]
    // if (!nestedObj) {
    //   return undefined
    // }

    return removeNull(cleanTypename(nestedObj))
  }
}

export const apiManager = new ApiManager(ApolloManager.client)
