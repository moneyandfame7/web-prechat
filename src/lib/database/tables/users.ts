import type Dexie from 'dexie'
import type {ApiUser} from 'types/api'

export default class Users {
  public constructor(private readonly table: Dexie.Table<ApiUser, string>) {}

  public async getInitialState() {
    const users = await this.table.toArray()
    const contactIds = await this.getContacts()

    return {
      users,
      contactIds
    }
  }

  public async put(users: ApiUser[] | ApiUser) {
    return users instanceof Array ? this.table.bulkPut(users) : this.table.put(users)
  }

  public async add(user: ApiUser) {
    return this.table.put(user)
  }

  public async getContacts(): Promise<string[]> {
    return this.table.filter((u) => u.isContact || false).primaryKeys()
  }

  /* buldAdd? */
}
