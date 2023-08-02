import type Dexie from 'dexie'

import type {PersistGlobalState} from 'state/persist'

import errors from 'lib/i18n/errors'
import lang from 'lib/i18n/lang'
import {LEFT_COLUMN_WIDTH} from 'common/config'
import type {DatabaseTableNames} from '../root'
import {DatabaseTable, type TableKeys} from '../table'

const INITIAL_SETTINGS_STATE: PersistGlobalState[DatabaseTableNames.Settings] = {
  i18n: {
    countries: [],
    errors: errors,
    lang_code: 'en',
    pack: lang
  },
  leftColumnWidth: LEFT_COLUMN_WIDTH,
  theme: 'system',
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
