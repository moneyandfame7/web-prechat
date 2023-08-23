import {
  type FC,
  type TargetedEvent,
  memo,
  useCallback,
  useEffect,
  useRef,
  useState,
  useLayoutEffect
} from 'preact/compat'
import {useComputed, useSignal} from '@preact/signals'

import type {ApiCountry} from 'api/types/langPack'

import {changeLanguage, t, useTranslateString} from 'lib/i18n'
import {getGlobalState} from 'state/signal'
import {selectSuggestedCountry} from 'state/selectors/auth'

import {Button, Checkbox} from 'components/ui'
import {Logo} from 'components/Logo'

import {PhoneNumberInput} from './PhoneNumberInput'
import {SelectCountryInput} from './SelectCountryInput'

import {unformatStr} from 'utilities/string/stringRemoveSpacing'
import {validatePhone} from 'utilities/phone/validatePhone'

import {combinedStore} from 'store/combined'

import './AuthPhoneNumber.scss'

const AuthPhoneNumber: FC = () => {
  const appState = combinedStore.getState()
  const appActions = combinedStore.getActions()
  // const {getCountries} = getActions()
  const state = getGlobalState()
  const phoneInputRef = useRef<HTMLInputElement>(null)

  const phone = useSignal('')
  const isFormDisabled = useComputed(() => !validatePhone(unformatStr(phone.value)))

  const [country, setCountry] = useState<ApiCountry | undefined>()
  const translateLoading = useSignal(false)
  const translateString = useTranslateString(
    'Auth.ContinueOnLanguage',
    appState.settings.suggestedLanguage
  )
  useLayoutEffect(() => {
    // initializeAuth()
    // appManager.appAuthManager.init()
    appActions.auth.init()
  }, [])
  useEffect(() => {
    appActions.help.getCountriesList({
      lang: appState.settings.language
    })
  }, [appState.settings.language])

  useEffect(() => {
    const suggested = appState.help.countriesList.find(
      (c) => c.dial_code === country?.dial_code
    )
    setCountry(suggested)
  }, [appState.help.countriesList])
  useEffect(() => {
    if (appState.auth.connection && appState.help.countriesList.length) {
      const suggestedCountry = combinedStore.select(selectSuggestedCountry)
      if (suggestedCountry && !country && !phone.value.length) {
        setCountry(suggestedCountry)
        phone.value = suggestedCountry.dial_code
      }
    }
  }, [appState.auth.connection, appState.help.countriesList])

  const handleChangePhone = useCallback(
    (value: string) => {
      const foundedCountry = appState.help.countriesList.find(
        (country) => country.dial_code === value.trim()
      )

      if (foundedCountry) {
        setCountry(foundedCountry)
      }
      phone.value = value /* .replace(/\s/g, '') */
    },
    [appState.help.countriesList, country]
  )

  const handleSelectCountry = useCallback(
    (country: ApiCountry) => {
      setCountry(country)
      phone.value = country.dial_code
      phoneInputRef.current?.focus()
    },
    [
      /* phoneInputRef */
    ]
  )
  const handleChangeLanguage = useCallback(async () => {
    const suggestedLng = appState.settings.suggestedLanguage
    if (suggestedLng) {
      translateLoading.value = true
      await changeLanguage(suggestedLng)

      translateLoading.value = false
    }
  }, [appState.settings.suggestedLanguage])

  const handleChangeRememberMe = useCallback((checked: boolean) => {
    // state.auth.rememberMe = checked
    appState.auth.rememberMe = checked
  }, [])

  const handleSubmit = (e: TargetedEvent<HTMLFormElement, Event>) => {
    e.preventDefault()

    // console.log(phone.value)
    appActions.auth.sendPhone(phone.value)
  }

  return (
    <>
      <Logo />
      <h1 class="title">{t('Auth.Signin')}</h1>
      <p class="subtitle">{t('Auth.ConfirmNumber')}</p>
      <form onSubmit={handleSubmit}>
        <SelectCountryInput
          loading={/* !state.countryList.length || */ !appState.auth.connection}
          countryList={appState.help.countriesList}
          handleSelect={handleSelectCountry}
          selectedCountry={country}
        />

        <PhoneNumberInput
          autoFocus
          elRef={phoneInputRef}
          onInput={handleChangePhone}
          value={phone}
        />
        <Checkbox
          id="remember-me"
          label={t('RememberMe')}
          onToggle={handleChangeRememberMe}
          disabled={appState.auth.isLoading}
          /* якщо тут передати не сигнал, буде ререндер всього компоненту */
          checked={appState.auth.$rememberMe!}
        />
        <Button
          type="submit"
          isLoading={appState.auth.isLoading}
          isDisabled={isFormDisabled}
        >
          {appState.auth.error || t('Next')}
        </Button>

        {appState.settings.suggestedLanguage !== state.settings.i18n.lang_code && (
          <Button
            variant="transparent"
            onClick={handleChangeLanguage}
            isLoading={translateLoading.value}
            isDisabled={appState.auth.$isLoading}
          >
            {translateString}
          </Button>
        )}
      </form>
      <div id="auth-recaptcha-wrapper">
        <div id="auth-recaptcha" />
      </div>
    </>
  )
}

export default memo(AuthPhoneNumber)
