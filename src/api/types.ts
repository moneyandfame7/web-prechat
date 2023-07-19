// import type {ApolloQueryResult, FetchResult, Observable} from '@apollo/client'
// import type {
//   Country,
//   FetchLanguage,
//   SendPhoneResponse,
//   SignInInput,
//   SignInResponse,
//   SignUpInput,
//   SignUpResponse,
//   TwoFactorAuth
// } from 'types/api'
// import type {
//   LanguagePack,
//   LanguagePackKeys,
//   SupportedLanguages
// } from 'types/lib'

/**
 * Promise<Observable<FetchResult<any>>> - subscribe
 * Promise<FetchResult<any>> - mutation
 * Promise<ApolloQueryResult<T>> - query
 *
 */
// type ApolloResult<T = any> = Promise<
//   Observable<FetchResult<T>> | FetchResult<T> | ApolloQueryResult<T>
// >

// interface ApiAuthMethods {
//   sendPhone: (phone: string) => ApolloResult<{sendPhone: SendPhoneResponse}>
//   signIn: (input: SignInInput) => ApolloResult<{signIn: SignInResponse}>
//   signUp: (input: SignUpInput) => ApolloResult<{signUp: SignUpResponse}>
// }
// interface ApiHelpMethods {
//   fetchCountries: (language: SupportedLanguages) => Country[]
//   fetchLanguage: (language: SupportedLanguages) => LanguagePack
//   fetchLanguageString: (
//     language: SupportedLanguages,
//     string: LanguagePackKeys
//   ) => string
// }
// interface ApiTwoFaMethods {
//   get2FaInfo: (token: string) => ApolloResult<{getTwoFa?: TwoFactorAuth}>
// }
// interface ApiSettingsMethods {}

// type ApiMethods =
//   | ApiTwoFaMethods
//   | ApiHelpMethods
//   | ApiAuthMethods
//   | ApiSettingsMethods
// type ApiMethodsApollo<M extends ApiMethods> = {
//   [K in keyof M]: (args: Parameters<M[K]>[0]) => ApolloResult<{
//     [key in K]: ReturnType<M[K]>
//   }>
// }

// type ApiAuthMethodsApollo = ApiMethodsApollo<ApiAuthMethods>

// type ApiHelpMethodsApollo = ApiMethodsApollo<ApiHelpMethods>

// type ApiSettingsMethodsApollo = ApiMethodsApollo<ApiSettingsMethods>

// type ApiTwoFaMethodsApollo = ApiMethodsApollo<ApiTwoFaMethods>

// export type {
//   ApiTwoFaMethods,
//   ApiHelpMethods,
//   ApiAuthMethods,
//   ApiSettingsMethods
// }
