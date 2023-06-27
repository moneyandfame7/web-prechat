import Dexie from 'dexie'

import type { DeepPartial } from 'types/common'
import type { PersistGlobalState } from 'state/persist'

type AuthTableKeys = keyof PersistGlobalState['auth']

interface StateTableEntry<K extends AuthTableKeys> {
  key: K
  value: DeepPartial<PersistGlobalState['auth'][K]>
}

type StateTableEntries = StateTableEntry<AuthTableKeys>[]

// const INITIAL_AUTH_STATE: PersistGlobalState['auth'] = {
//   rememberMe: true,
//   email: undefined,
//   passwordHint: undefined,
//   phoneNumber: undefined,
//   session: undefined,
//   userId: undefined
// }
export default class AuthTable {
  public constructor(private readonly table: Dexie.Table<StateTableEntry<AuthTableKeys>, string>) {}

  public async change(item: DeepPartial<PersistGlobalState['auth']>) {
    const records = this.formatRecords(item)

    await this.table.bulkPut(records)
  }

  public async add(item: DeepPartial<PersistGlobalState['auth']>) {
    const records = this.formatRecords(item)

    await this.table.bulkAdd(records)
  }

  public async get() {
    const records = await this.table.toArray()
    const auth: DeepPartial<PersistGlobalState['auth']> = {}
    // eslint-disable-next-line array-callback-return
    records.map(({ key, value }) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      auth[key] = value as any
    })

    return auth
  }

  private formatRecords(item: DeepPartial<PersistGlobalState['auth']>) {
    const records: StateTableEntries = []
    const serialized = JSON.parse(JSON.stringify(item))

    for (const key in serialized) {
      records.push({
        key: key as AuthTableKeys,
        value: serialized[key as keyof typeof serialized]
      })
    }

    return records
  }
}
