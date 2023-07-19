import type {ApolloClient, NormalizedCacheObject} from '@apollo/client'

export class BaseService {
  public constructor(protected readonly client: ApolloClient<NormalizedCacheObject>) {}
}
