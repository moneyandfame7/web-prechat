import type { GlobalState } from 'types/state'

export const selectSuggestedCountry = (state: GlobalState) => {
  const code = state.auth.connection?.countryCode
  if (!code) return
  return state.countryList.find((country) => country.code === code)
}
