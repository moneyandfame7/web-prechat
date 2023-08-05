import type Dexie from 'dexie'

import type {PersistGlobalState} from 'state/persist'

import lang from 'lib/i18n/lang'
import type {DatabaseTableNames} from '../root'
import {DatabaseTable, type TableKeys} from '../table'

const INITIAL_SETTINGS_STATE: PersistGlobalState[DatabaseTableNames.Settings] = {
  i18n: {
    lang_code: 'en',
    pack: lang
  },
  theme: 'light',
  language: 'en',
  showTranslate: false,
  suggestedLanguage: undefined
}

export default class SettingsTable extends DatabaseTable<
  DatabaseTableNames.Settings,
  TableKeys<DatabaseTableNames.Settings>
> {
  public constructor(table: Dexie.Table) {
    super(table, INITIAL_SETTINGS_STATE)
  }
}
