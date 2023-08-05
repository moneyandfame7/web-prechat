import type {GlobalState} from 'types/state'
import type * as Api from './api/types'
/**
 * The idea for actions was taken from this repository because I really liked it
 * https://github.com/Ajaxy/telegram-tt
 */
export type ActionPayload = {
  /**
   * Langpack
   */
  getLanguageString: Api.LangpackGetLanguageStringPayload
  getLangPack: Api.LangpackGetLanguagePackPayload
  getLanguages: Api.LangPackGetLanguagesPayload

  /**
   * Help
   */
  getCountriesList: Api.HelpGetCountriesListPayload

  /**
   * Auth
   */
  signUp: Api.AuthSignUpPayload
  signIn: Api.AuthSignInPayload
  logOut: Api.AuthLogOutPayload

  /**
   * Account
   */
  getPassword: Api.AccountGetPasswordPayload

  /**
   * Global Search
   */
  searchGlobal: Api.SearchGlobalPayload
}

export type ActionName = keyof ActionPayload

export type ActionReturnType =
  | void
  | Promise<void>
  | GlobalState
  | undefined
  | Promise<undefined>
export type Actions = {
  [key in ActionName]: (payload: ActionPayload[key]) => ActionReturnType
}
