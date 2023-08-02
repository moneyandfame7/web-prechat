import type Dexie from 'dexie'
import type {ApiUser} from 'types/api'

export default class Contacts {
  public constructor(private readonly table: Dexie.Table<ApiUser, string>) {}

  public async updateContactList(users: ApiUser[]) {
    await this.table.bulkPut(users)
  }
}
