import Dexie from 'dexie'

import AuthTable from './tables/auth'
import UsersTable from './tables/users'
import SettingsTable from './tables/settings'

class Database {
  private readonly _db: Dexie

  private readonly DB_NAME = 'prechat'

  public readonly users: UsersTable
  public readonly auth: AuthTable
  public readonly settings: SettingsTable

  public constructor() {
    this._db = new Dexie(this.DB_NAME)
    this._db.version(1).stores({
      users: 'id, &username, &phoneNumber',
      settings: '&key',
      auth: '&key'
    })
    this._db.open()

    this.users = new UsersTable(this._db.table('users'))
    this.settings = new SettingsTable(this._db.table('settings'))
    this.auth = new AuthTable(this._db.table('auth'))
  }

  public async getInitialState() /* : Promise<DeepPartial<PersistGlobalState>> */ {
    const [auth, settings] = await Promise.all([
      this.auth.get(),
      this.settings.get()
      // this.users.getInitialState()
    ])

    const obj = {
      ...(auth ? {auth} : undefined),
      ...(settings ? {settings} : undefined)
    }
    if (!Object.keys(obj).length) {
      return undefined
    }

    return obj
  }

  public async clear() {
    const tables = this._db.tables

    for (const table of tables) {
      await table.clear()
    }

    // console.log('All tables cleared!');
  }
}

export const database = new Database()
