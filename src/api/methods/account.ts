import {
  MUTATION_ACCOUNT_UPDATE_USER_STATUS,
  MUTATION_TERMINATE_ALL_AUTHORIZATIONS,
  MUTATION_TERMINATE_AUTHORIZATION,
  MUTATION_UPDATE_AUTHORIZATION_ACTIVITY,
  QUERY_ACCOUNT_GET_AUTHORIZATIONS,
  QUERY_ACCOUNT_GET_PASSWORD,
} from 'api/graphql'

import {cleanTypename} from 'utilities/cleanTypename'

import {ApiBaseMethod} from '../base'

export class ApiAccount extends ApiBaseMethod {
  public async getPassword() {
    const {data} = await this.client.query({
      query: QUERY_ACCOUNT_GET_PASSWORD,
      fetchPolicy: 'cache-first',
    })
    if (!data.getPassword) {
      return undefined
    }

    return data.getPassword
  }

  /* Authorizations  */
  public async getAuthorizations() {
    const {data} = await this.client.query({
      query: QUERY_ACCOUNT_GET_AUTHORIZATIONS,
      fetchPolicy: 'cache-first',
    })
    // if(!data.getAuthorizations){
    //   return undefined
    // }

    return cleanTypename(data.getAuthorizations)
  }

  public async updateAuthorizationActivity() {
    const {data} = await this.client.mutate({
      mutation: MUTATION_UPDATE_AUTHORIZATION_ACTIVITY,
    })

    return data?.updateAuthorizationActivity
  }

  public async terminateAuthorization(id: string) {
    const {data} = await this.client.mutate({
      mutation: MUTATION_TERMINATE_AUTHORIZATION,
      variables: {
        id,
      },
    })

    return Boolean(data?.terminateAuthorization)
  }

  public async terminateAllAuthorizations() {
    const {data} = await this.client.mutate({
      mutation: MUTATION_TERMINATE_ALL_AUTHORIZATIONS,
    })

    return Boolean(data?.terminateAllAuthorizations)
  }

  public async updateUserStatus(online: boolean) {
    const {data} = await this.client.mutate({
      mutation: MUTATION_ACCOUNT_UPDATE_USER_STATUS,
      variables: {
        online,
      },
    })

    return data?.updateUserStatus
  }

  public async updatePassword() {
    /*  */
  }

  public async disablePassword() {
    /* Disable */
  }

  public async deleteAccount() {
    /* Delete account */
  }

  public async getPrivacy() {
    /* Get  */
  }

  public async setPrivacy() {
    /* Set */
  }
}
