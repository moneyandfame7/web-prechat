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

import type {ApiCountry} from 'api/types/langPack'

import {changeLanguage, t, useTranslateString} from 'lib/i18n'
import {getActions} from 'state/action'
import {getGlobalState} from 'state/signal'
import {selectCountryByPhone, selectSuggestedCountry} from 'state/selectors/auth'
import {initializeAuth} from 'state/initialize'

import {Button, Checkbox} from 'components/ui'
import {Logo} from 'components/Logo'

import {PhoneNumberInput} from './PhoneNumberInput'
import {SelectCountryInput} from './SelectCountryInput'

// import {updateGlobalState} from 'state/persist'
import './AuthPhoneNumber.scss'
import {useComputed, useSignal} from '@preact/signals'
import {unformatStr} from 'utilities/string/stringRemoveSpacing'
import {validatePhone} from 'utilities/phone/validatePhone'

const AuthPhoneNumber: FC = () => {
  const {sendPhone, getCountries} = getActions()
  const state = getGlobalState()
  const phoneInputRef = useRef<HTMLInputElement>(null)

  const phone = useSignal('')
  const isFormDisabled = useComputed(() => !validatePhone(unformatStr(phone.value)))

  const [country, setCountry] = useState<ApiCountry | undefined>(
    selectCountryByPhone(state)
  )
  const translateLoading = useSignal(false)
  const translateString = useTranslateString(
    'Auth.ContinueOnLanguage',
    state.settings.suggestedLanguage
  )
  useLayoutEffect(() => {
    initializeAuth()
  }, [])
  useEffect(() => {
    getCountries(state.settings.language)
  }, [state.settings.language])

  useEffect(() => {
    setCountry(state.countryList.find((c) => c.dial_code === country?.dial_code))
  }, [state.countryList])
  useEffect(() => {
    if (state.auth.connection && state.countryList.length) {
      const suggestedCountry = selectSuggestedCountry(state)
      if (suggestedCountry && !country && !phone.value.length) {
        setCountry(suggestedCountry)
        phone.value = suggestedCountry.dial_code
      }
    }
  }, [state.auth.connection, state.countryList])

  const handleChangePhone = useCallback(
    (value: string) => {
      const foundedCountry = state.countryList.find(
        (country) => country.dial_code === value.trim()
      )

      if (foundedCountry) {
        setCountry(foundedCountry)
      }
      phone.value = value /* .replace(/\s/g, '') */
    },
    [state.countryList, country]
  )

  const handleSelectCountry = useCallback(
    (country: ApiCountry) => {
      setCountry(country)
      phone.value = country.dial_code
      phoneInputRef.current?.focus()
    },
    [phoneInputRef]
  )
  const handleChangeLanguage = useCallback(async () => {
    const suggestedLng = state.settings.suggestedLanguage
    if (suggestedLng) {
      translateLoading.value = true
      await changeLanguage(suggestedLng)

      translateLoading.value = false
    }
  }, [state.settings.suggestedLanguage])

  const handleChangeRememberMe = useCallback((checked: boolean) => {
    state.auth.rememberMe = checked
  }, [])

  const handleSubmit = (e: TargetedEvent<HTMLFormElement, Event>) => {
    e.preventDefault()

    sendPhone(phone.value)
  }

  return (
    <>
      <Logo />
      <h1 class="title">{t('Auth.Signin')}</h1>
      <p class="subtitle">{t('Auth.ConfirmNumber')}</p>
      <form onSubmit={handleSubmit}>
        <SelectCountryInput
          loading={!state.countryList.length || !state.auth.connection}
          countryList={state.countryList}
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
          disabled={state.auth.isLoading}
          /* якщо тут передати не сигнал, буде ререндер всього компоненту */
          checked={state.auth.$rememberMe!}
        />
        <Button
          type="submit"
          isLoading={state.auth.isLoading}
          isDisabled={isFormDisabled}
        >
          {state.auth.error || t('Next')}
        </Button>

        {state.settings.suggestedLanguage !== state.settings.i18n.lang_code && (
          <Button
            variant="transparent"
            onClick={handleChangeLanguage}
            isLoading={translateLoading.value}
            isDisabled={state.auth.$isLoading}
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
