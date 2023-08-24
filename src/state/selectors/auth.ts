import type {SignalGlobalState} from 'types/state'

export const selectSuggestedCountry = (state: SignalGlobalState) => {
  const code = state.auth.connection?.countryCode
  if (!code) return
  return state.countryList.find((country) => country.code === code)
}

export const selectCountryByPhone = (state: SignalGlobalState) => {
  const {
    auth: {phoneNumber},
    countryList
  } = state

  if (!phoneNumber) {
    return
  }
  return countryList.find((country) => phoneNumber.includes(country.dial_code))
}
