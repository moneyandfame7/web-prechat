import type {SignalGlobalState} from 'types/state'

export const selectSuggestedCountry = (state: SignalGlobalState) => {
  const code = state.auth.connection?.countryCode
  if (!code) return
  return state.countryList.find((country) => country.code === code)
}
