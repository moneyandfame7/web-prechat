import {
  // MUTATION_ACCOUNT_UPDATE_PASSWORD,
  QUERY_ACCOUNT_GET_PASSWORD
} from './../graphql/account'
import {ApiBaseMethod} from './base'

export class ApiAccount extends ApiBaseMethod {
  public async getPassword() {
    const {data} = await this.client.query({
      query: QUERY_ACCOUNT_GET_PASSWORD,
      fetchPolicy: 'cache-first'
    })
    if (!data.getPassword) {
      return undefined
    }

    return data.getPassword
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
