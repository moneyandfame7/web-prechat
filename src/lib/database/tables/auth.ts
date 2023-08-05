import type Dexie from 'dexie'

import {AuthScreens} from 'types/screens'
import {DatabaseTable, type TableKeys} from '../table'
const INITIAL_AUTH_STATE = {
  rememberMe: true,
  email: undefined,
  passwordHint: undefined,
  phoneNumber: undefined,
  session: undefined,
  userId: undefined,
  screen: AuthScreens.PhoneNumber
}

export default class AuthTable extends DatabaseTable<'auth', TableKeys<'auth'>> {
  public constructor(table: Dexie.Table) {
    super(table, INITIAL_AUTH_STATE)
  }
}
