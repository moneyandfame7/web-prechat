import {deepClone} from 'utilities/object/deepClone'
import type Dexie from 'dexie'
import {logDebugWarn} from 'lib/logger'

import type {PersistedState, PersistedKeys} from 'state/persist'
import type {DeepPartial} from 'types/common'

export type TableKeys<Name extends PersistedKeys> = keyof PersistedState[Name]

export interface TableEntity<Name extends PersistedKeys, Keys extends TableKeys<Name>> {
  key: Keys
  value: DeepPartial<PersistedState[Name][Keys]>
}

export type TableManyEntities<
  N extends PersistedKeys,
  K extends TableKeys<N>
> = TableEntity<N, K>[]

export class DatabaseTable<Name extends PersistedKeys, Keys extends TableKeys<Name>> {
  protected constructor(
    protected readonly _table: Dexie.Table<TableEntity<Name, Keys>, string>,
    protected readonly initialState: PersistedState[Name]
  ) {}

  public async change<T extends DeepPartial<PersistedState[Name]>>(
    item: T
  ): Promise<void> {
    if (!item) {
      logDebugWarn('NOTHING TO SERIALIZE')
      return
    }
    const records: TableManyEntities<Name, Keys> = []

    const serialized: T = deepClone(item)

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
    if (!array.length) {
      return undefined
    }
    const records: DeepPartial<PersistedState[Name]> = {}
    // eslint-disable-next-line array-callback-return
    array.map(({key, value}) => {
      records[key] = value
    })

    return records
  }
}
