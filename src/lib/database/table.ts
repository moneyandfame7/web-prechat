import type Dexie from 'dexie'
import {logDebugWarn} from 'lib/logger'

import type {PersistGlobalState, PersistGlobalStateKeys} from 'state/persist'
import type {DeepPartial} from 'types/common'

export type TableKeys<Name extends PersistGlobalStateKeys> =
  keyof PersistGlobalState[Name]

export interface TableEntity<
  Name extends PersistGlobalStateKeys,
  Keys extends TableKeys<Name>
> {
  key: Keys
  value: DeepPartial<PersistGlobalState[Name][Keys]>
}

export type TableManyEntities<
  N extends PersistGlobalStateKeys,
  K extends TableKeys<N>
> = TableEntity<N, K>[]

export class DatabaseTable<
  Name extends PersistGlobalStateKeys,
  Keys extends TableKeys<Name>
> {
  protected constructor(
    protected readonly _table: Dexie.Table<TableEntity<Name, Keys>, string>,
    protected readonly initialState: PersistGlobalState[Name]
  ) {}

  public async change<T extends DeepPartial<PersistGlobalState[Name]>>(
    item: T
  ): Promise<void> {
    if (!item) {
      logDebugWarn('NOTHING TO SERIALIZE')
      return
    }
    const records: TableManyEntities<Name, Keys> = []
    const serialized: T = JSON.parse(JSON.stringify(item))

    for (const key in serialized) {
      records.push({
        /** idk how to do it right */
        key: key as unknown as Keys,
        value: serialized[key]
      })
    }
    await this._table.bulkPut(records)
  }

  public async get() {
    const array = await this._table.toArray()

    const records: DeepPartial<PersistGlobalState[Name]> = {}
    // eslint-disable-next-line array-callback-return
    array.map(({key, value}) => {
      records[key] = value
    })

    return records
  }

  public async reset() {
    return this._table.clear()
  }

  public testTypes<T extends DeepPartial<PersistGlobalState[Name]>>(item: T) {
    const serialized: T = JSON.parse(JSON.stringify(item))

    return serialized
  }
}
