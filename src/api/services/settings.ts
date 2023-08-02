import {BaseService} from './base'

export interface ApiSettingsMethods {}

export class ApiSettings extends BaseService implements ApiSettingsMethods {
  public async test() {
    return this.client
  }
}
