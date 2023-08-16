import {deepClone} from 'utilities/object/deepClone'

import {type Database, type StorageName} from './database'

// interface SchemaEntity<Key extends string, Value> {
//   value: Value
//   key: Key
// }
// interface DatabaseSchema extends DBSchema {
//   users: SchemaEntity<string, ApiUser>
//   chats: SchemaEntity<string, ApiChat>
//   state: SchemaEntity<keyof State, State[keyof State]>
// }

export class RootStorage<Storage extends Record<string, any>> {
  public constructor(private database: Database, private name: StorageName) {}

  public async getAll(): Promise<Storage | undefined> {
    return this.database.getAll(this.name) as any
  }

  public async get<T extends keyof Storage>(key: T): Promise<Storage[T] | undefined> {
    // const result = (await this.database.idb.get(this.name, key as string)) as
    //   | Storage[T]
    //   | undefined

    const result = (await this.database.idb).get(this.name, key as string)
    // const test = await this.database.idb.get(this.name, key as string)
    console.log({result})

    return result
  }

  public async set(obj: Partial<Storage>) {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const value = deepClone(obj[key])
        this.database.set(this.name, value, key)
      }
    }
    // return this.database.set(this.name, value, key as string)
  }

  public async delete<T extends keyof Storage>(key: T): Promise<boolean> {
    return this.database.delete(this.name, key as string)
  }

  public async clear() {
    return this.database.clear(this.name)
  }
}

// interface FileStorage {}
// export const filesStorage = new RootStorage<Record<string, FileStorage>>(
//   database,
//   'files'
// )
