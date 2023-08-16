import type {ApiUser, ApiChat} from 'api/types'

import type {PersistedState} from 'state/persist'

import {RootStorage} from './keyval'
import {database, type Database} from './database'
export class StorageManager {
  public users: RootStorage<Record<string, ApiUser>>
  public chats: RootStorage<Record<string, ApiChat>>
  public state: RootStorage<PersistedState['state']>

  public constructor(db: Database) {
    this.users = new RootStorage(db, 'users')
    this.chats = new RootStorage(db, 'chats')
    this.state = new RootStorage(db, 'state')
  }

  public async loadAll() {
    const users = await this.users.getAll()
    const chats = await this.chats.getAll()
    const state = await this.state.getAll()

    return {
      users,
      chats,
      state
    }
  }

  public async clearAll() {
    await Promise.all([this.users.clear(), this.chats.clear(), this.state.clear()])
  }
}

export const storageManager = new StorageManager(database)
