import type { SignalGlobalState } from 'types/state'

export const selectSuggestedCountry = (state: SignalGlobalState) => {
  const code = state.auth.connection?.countryCode
  if (!code) return
  return state.settings.i18n.countries.find((country) => country.code === code)
}

export const selectCountryByPhone = (state: SignalGlobalState) => {
  const phone = state.auth.phoneNumber
  const countries = state.settings.i18n.countries

  if (!phone) {
    return
  }
  return countries.find((country) => phone.includes(country.dial_code))
}
