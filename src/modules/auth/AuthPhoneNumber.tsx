import {
  type FC,
  type TargetedEvent,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useLayoutEffect
} from 'preact/compat'

import {changeLanguage, t, useTranslateString} from 'lib/i18n'
import {getActions} from 'state/action'
import {getGlobalState} from 'state/signal'
import {selectCountryByPhone, selectSuggestedCountry} from 'state/selectors/auth'
import {initializeAuth} from 'state/initialize'

import {formatPhoneNumber} from 'utilities/formatPhoneNumber'

import {DEBUG} from 'common/config'

import {Button, Checkbox} from 'components/ui'
import {Logo} from 'components/Logo'

import {PhoneNumberInput} from './PhoneNumberInput'
import {SelectCountryInput} from './SelectCountryInput'

// import {updateGlobalState} from 'state/persist'
import './AuthPhoneNumber.scss'
import type {ApiCountry} from 'api/types/langPack'

const IS_PHONE_VAL_REG = /^\+\d{1,4}\s?\d{10,}$/

function validatePhone(phone: string) {
  const matched = IS_PHONE_VAL_REG.test(phone)
  if (DEBUG) {
    return matched || phone === '+12345678'
  }

  return matched
}

const AuthPhoneNumber: FC = () => {
  const {sendPhone, getCountries} = getActions()
  const state = getGlobalState()
  const phoneInputRef = useRef<HTMLInputElement>(null)
  useLayoutEffect(() => {
    initializeAuth()
  }, [])
  const [phone, setPhone] = useState<string>('')
  const [country, setCountry] = useState<ApiCountry | undefined>(
    selectCountryByPhone(state)
  )
  const [translateLoading, setTranslateLoading] = useState(false)
  const translateString = useTranslateString(
    'Auth.ContinueOnLanguage',
    state.settings.suggestedLanguage
  )
  useEffect(() => {
    getCountries(state.settings.language)
  }, [state.settings.language])

  useEffect(() => {
    setCountry(state.countryList.find((c) => c.dial_code === country?.dial_code))
  }, [state.countryList])
  useEffect(() => {
    if (state.auth.connection && state.countryList.length) {
      const suggestedCountry = selectSuggestedCountry(state)
      if (suggestedCountry && !country && !phone.length) {
        setCountry(suggestedCountry)
        setPhone(suggestedCountry?.dial_code)
      }
    }
  }, [state.auth.connection, state.countryList])

  const handleChangePhone = useCallback(
    (phone: string) => {
      const foundedCountry = state.countryList.find(
        (country) => country.dial_code === phone.trim()
      )

      if (foundedCountry) {
        setCountry(foundedCountry)
      }

      setPhone(phone.replace(/\s/g, ''))
    },
    [state.countryList, country]
  )

  const handleSelectCountry = useCallback(
    (country: ApiCountry) => {
      setCountry(country)
      setPhone(country.dial_code)

      phoneInputRef.current?.focus()
    },
    [phoneInputRef]
  )
  const handleChangeLanguage = useCallback(async () => {
    const suggestedLng = state.settings.suggestedLanguage
    if (suggestedLng) {
      setTranslateLoading(true)
      await changeLanguage(suggestedLng)

      setTranslateLoading(false)
    }
  }, [state.settings.suggestedLanguage])

  const handleChangeRememberMe = useCallback((checked: boolean) => {
    state.auth.rememberMe = checked
  }, [])

  const formattedPhone = useMemo(
    () => formatPhoneNumber(phone, country?.dial_code),
    [phone, country?.dial_code]
  )

  const handleSubmit = useCallback(
    (e: TargetedEvent<HTMLFormElement, Event>) => {
      e.preventDefault()

      sendPhone(formattedPhone.formatted)
    },
    [formattedPhone]
  )

  const isValidPhone = useMemo(() => validatePhone(phone.trim()), [phone])

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
          remainingPattern={formattedPhone.remainingPattern}
          value={formattedPhone.formatted}
        />
        <Checkbox
          id="remember-me"
          label={t('RememberMe')}
          onToggle={handleChangeRememberMe}
          disabled={state.auth.isLoading}
          /* якщо тут передати не сигнал, буде ререндер всього компоненту */
          checked={state.auth.$rememberMe!}
        />
        {isValidPhone && (
          <Button type="submit" isLoading={state.auth.isLoading}>
            {state.auth.error || t('Next')}
          </Button>
        )}

        {translateString &&
          state.settings.suggestedLanguage !== state.settings.i18n.lang_code && (
            <Button
              variant="transparent"
              onClick={handleChangeLanguage}
              isLoading={translateLoading}
              isDisabled={state.auth.isLoading}
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
