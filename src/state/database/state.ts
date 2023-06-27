import { DeepPartial } from 'types/common'
import Dexie from 'dexie'
import { PersistGlobalState } from 'state/persist'

interface StateTableEntry<K extends keyof PersistGlobalState> {
  key: K
  value: DeepPartial<PersistGlobalState[K]>
}

export default class StateTable {
  public constructor(
    private readonly table: Dexie.Table<StateTableEntry<keyof PersistGlobalState>, string>
  ) {}

  public async change<K extends keyof PersistGlobalState>(item: StateTableEntry<K>) {
    await this.table.put(item)
  }

  public async getAll() {
    const entries: StateTableEntry<keyof PersistGlobalState>[] = await this.table.toArray()

    return entries
  }

  public async initialize() {
    // const defaultRecord: StateTableEntry<keyof State>[] = [
    //   {
    //     key: 'session',
    //     value: {} as Session
    //   },
    //   {
    //     key: 'language',
    //     value: 'en'
    //   },
    //   {
    //     key: 'theme',
    //     value: 'light'
    //   }
    // ]
    // await this.table.bulkPut(defaultRecord)
  }
}
