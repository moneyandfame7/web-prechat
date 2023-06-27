import Dexie from 'dexie'

import type { DeepPartial } from 'types/common'
import type { PersistGlobalState } from 'state/persist'

import DbUsers from './users'
import DbAuth from './auth'
import DbSettings from './settings'

const DB_NAME = 'prechat'
export enum DatabaseTables {
  Users = 'users',
  Auth = 'auth',
  Settings = 'settings'
}

class Database {
  private readonly db: Dexie

  public readonly users: DbUsers
  public readonly auth: DbAuth
  public readonly settings: DbSettings
  public constructor() {
    this.db = new Dexie(DB_NAME)
    this.db.version(1).stores({
      users: 'id',
      settings: '&key',
      auth: '&key'
    })
    this.db.open()

    this.users = new DbUsers(this.db.table(DatabaseTables.Users))
    this.settings = new DbSettings(this.db.table(DatabaseTables.Settings))
    this.auth = new DbAuth(this.db.table(DatabaseTables.Auth))
  }

  public async getInitialState(): Promise<DeepPartial<PersistGlobalState>> {
    const [auth, settings] = await Promise.all([this.auth.get(), this.settings.get()])

    return {
      auth,
      settings
    }
  }
}

export const database = new Database()
