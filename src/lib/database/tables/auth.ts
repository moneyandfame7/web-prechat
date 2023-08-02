import type Dexie from 'dexie'

import type {PersistGlobalState} from 'state/persist'
import {AuthScreens} from 'types/screens'
import {DatabaseTable, type TableKeys} from '../table'
import type {DatabaseTableNames} from '../root'
const INITIAL_AUTH_STATE: PersistGlobalState[DatabaseTableNames.Auth] = {
  rememberMe: true,
  email: undefined,
  passwordHint: undefined,
  phoneNumber: undefined,
  session: undefined,
  userId: undefined,
  screen: AuthScreens.PhoneNumber
}

export default class AuthTable extends DatabaseTable<
  DatabaseTableNames.Auth,
  TableKeys<DatabaseTableNames.Auth>
> {
  public constructor(table: Dexie.Table) {
    super(table, INITIAL_AUTH_STATE)
  }
}
