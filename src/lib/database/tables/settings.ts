import type Dexie from 'dexie'

import lang from 'lib/i18n/lang'
import {DatabaseTable, type TableKeys} from '../table'
import type {PersistedState} from 'state/persist'

const INITIAL_SETTINGS_STATE: PersistedState['settings'] = {
  i18n: {
    lang_code: 'en',
    pack: lang
  },
  theme: 'light',
  language: 'en',
  showTranslate: false,
  suggestedLanguage: undefined,
  animationLevel: 2,
  isCacheSupported: true
}

export default class SettingsTable extends DatabaseTable<
  'settings',
  TableKeys<'settings'>
> {
  public constructor(table: Dexie.Table) {
    super(table, INITIAL_SETTINGS_STATE)
  }
}
