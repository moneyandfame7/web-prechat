import type {ApiChat, ApiUser} from 'api/types'

import type {State} from 'types/state'

import type {Database} from 'lib/idb/database'
import {RootStorage} from 'lib/idb/keyval'

export type MainStorages = {
  users: RootStorage<Record<string, ApiUser>>
  chats: RootStorage<Record<string, ApiChat>>
  state: RootStorage<State>
}

type MainStoragesName = keyof MainStorages
function createStorages(database: Database) {
  const names: MainStoragesName[] = ['chats', 'users', 'state']
  const storages: MainStorages = {} as MainStorages
  for (const name of names) {
    // @ts-expect-error just ignore it
    storages[name] = new RootStorage(database, name)
  }

  return storages
}

export class AppStorageManager {
  private storages: ReturnType<typeof createStorages>

  public constructor(database: Database) {
    this.storages = createStorages(database)
  }

  public async loadStorage<T extends MainStoragesName>(
    name: T
  ): Promise<{
    storage: MainStorages[T]
    result: Awaited<ReturnType<MainStorages[T]['getAll']>>
  }> {
    return {
      storage: this.storages[name],
      result: (await this.storages[name].getAll()) as any
    }
  }
}
