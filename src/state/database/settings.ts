import Dexie from 'dexie'

import type { DeepPartial } from 'types/common'
import type { PersistGlobalState } from 'state/persist'
// import lang from 'lib/i18n/lang'

type SettingsTableKeys = keyof PersistGlobalState['settings']

interface StateTableEntry<K extends SettingsTableKeys> {
  key: K
  value: DeepPartial<PersistGlobalState['settings'][K]>
}
type StateTableEntries = StateTableEntry<SettingsTableKeys>[]

// const INITIAL_SETTINGS_STATE: PersistGlobalState['settings'] = {
//   i18n: {
//     countries: [],
//     lang_code: 'en',
//     pack: lang
//   },
//   theme: 'system',
//   suggestedLanguage: undefined
// }

export default class SettingsTable {
  public constructor(
    private readonly table: Dexie.Table<StateTableEntry<SettingsTableKeys>, string>
  ) {}

  public async change(item: DeepPartial<PersistGlobalState['settings']>) {
    const records: StateTableEntries = []
    const serialized = JSON.parse(JSON.stringify(item))

    for (const key in serialized) {
      records.push({
        key: key as SettingsTableKeys,
        value: serialized[key as keyof typeof serialized]
      })
    }

    await this.table.bulkPut(records)
  }

  public async get() {
    const records = await this.table.toArray()
    const settings: DeepPartial<PersistGlobalState['settings']> = {}
    // eslint-disable-next-line array-callback-return
    records.map(({ key, value }) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      settings[key] = value as any
    })

    return settings
  }
}

// export default class StateTable {
//   public constructor(
//     private readonly table: Dexie.Table<StateTableEntry<keyof PersistGlobalState>, string>
//   ) {}

//   public async change<K extends keyof PersistGlobalState>(item: StateTableEntry<K>) {
//     await this.table.put(item)
//   }

//   public async getAll() {
//     const entries: StateTableEntry<keyof PersistGlobalState>[] = await this.table.toArray()

//     return entries
//   }

//   public async initialize() {
//     // const defaultRecord: StateTableEntry<keyof State>[] = [
//     //   {
//     //     key: 'session',
//     //     value: {} as Session
//     //   },
//     //   {
//     //     key: 'language',
//     //     value: 'en'
//     //   },
//     //   {
//     //     key: 'theme',
//     //     value: 'light'
//     //   }
//     // ]
//     // await this.table.bulkPut(defaultRecord)
//   }
// }
