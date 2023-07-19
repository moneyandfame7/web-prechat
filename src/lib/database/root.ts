import Dexie from 'dexie'

import type {DeepPartial} from 'types/common'
import type {PersistGlobalState} from 'state/persist'

import {logDebugInfo} from 'lib/logger'

import UsersTable from './users'
import AuthTable from './auth'
import SettingsTable from './settings'

export enum DatabaseTableNames {
  Users = 'users',
  Auth = 'auth',
  Settings = 'settings'
}

class Database {
  private readonly _db: Dexie

  private readonly DB_NAME = 'prechat'

  public readonly users: UsersTable
  public readonly auth: AuthTable
  public readonly settings: SettingsTable
  public constructor() {
    this._db = new Dexie(this.DB_NAME)
    this._db.version(1).stores({
      users: 'id',
      settings: '&key',
      auth: '&key'
    })
    this._db.open()

    this.users = new UsersTable(this._db.table(DatabaseTableNames.Users))
    this.settings = new SettingsTable(this._db.table(DatabaseTableNames.Settings))
    this.auth = new AuthTable(this._db.table(DatabaseTableNames.Auth))
  }

  public async getInitialState(): Promise<DeepPartial<PersistGlobalState>> {
    const [auth, settings] = await Promise.all([this.auth.get(), this.settings.get()])

    return {
      auth,
      settings
    }
  }

  public async resetState(): Promise<void> {
    const start = Date.now()

    logDebugInfo(Date.now() - start, '[DB INIT]')
  }
}

export const database = new Database()
