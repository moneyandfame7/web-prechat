import type {ApolloClient, NormalizedCacheObject} from '@apollo/client'

export class ApiBaseMethod {
  public constructor(protected readonly client: ApolloClient<NormalizedCacheObject>) {}
}
