import type {ApolloClient, NormalizedCacheObject} from '@apollo/client'

export class ApiBaseMethod {
  // eslint-disable-next-line no-useless-constructor
  public constructor(protected readonly client: ApolloClient<NormalizedCacheObject>) {}
}
