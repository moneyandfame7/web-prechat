import {BaseService} from './base'

export interface ApiSettingsMethods {}

export class ApiSettings extends BaseService {
  public async test() {
    return this.client
  }
}
