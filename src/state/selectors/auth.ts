import type {AppState, SignalAppState} from 'store/combined'
import type {SignalGlobalState} from 'types/state'

export const selectSuggestedCountry = (state: SignalAppState) => {
  const code = state.auth.connection?.countryCode
  if (!code) return
  return state.help.countriesList.find((country) => country.code === code)
}

export const selectCountryByPhone = (state: SignalAppState) => {
  const {
    auth: {phoneNumber},
    countryList
  } = state

  if (!phoneNumber) {
    return
  }
  return countryList.find((country) => phoneNumber.includes(country.dial_code))
}
