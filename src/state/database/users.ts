import Dexie from 'dexie'

interface User {
  id: string
  username: string | null
  phoneNumber: string
  first_name: string
  last_name: string | null
  bio: string | null
  created_at: string
  avatar_id: string
}
export default class Users {
  public constructor(private readonly table: Dexie.Table<User, string>) {}

  public async getAll() {
    return this.table.toArray()
  }

  public async remove(id: string) {
    return this.table.delete(id)
  }

  public async add(user: User) {
    return this.table.add(user, user.id)
  }

  /* buldAdd? */
}
