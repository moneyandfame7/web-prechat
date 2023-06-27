import {
  FC,
  TargetedEvent,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'preact/compat'

import { changeLanguage, t, useTranslateString } from 'lib/i18n'
import { getActions } from 'state/action'
import { getGlobalState } from 'state/signal'
import { selectCountryByPhone, selectSuggestedCountry } from 'state/selectors/auth'
import { updateGlobalState } from 'state/persist'

import type { Country } from 'types/api'

import { Button } from 'components/Button'
import { Checkbox } from 'components/Checkbox'
import { Logo } from 'components/Logo'

import { PhoneNumberInput } from './PhoneNumberInput'
import { SelectCountryInput } from './SelectCountryInput'

import './AuthPhoneNumber.scss'

const IS_PHONE_VAL_REG = /^\+\d{1,4}\s?\d{7,}$/

const AuthPhoneNumber: FC = () => {
  const { getCountries, sendPhone } = getActions()
  const state = getGlobalState()
  const phoneInputRef = useRef<HTMLInputElement>(null)

  const [phone, setPhone] = useState<string>(state.auth.phoneNumber || '')
  const [country, setCountry] = useState<Country | undefined>(selectCountryByPhone(state))

  useEffect(() => {
    getCountries(state.settings.i18n.lang_code)
  }, [state.settings.i18n.lang_code])

  useEffect(() => {
    if (state.auth.connection && state.settings.i18n.countries.length) {
      const suggestedCountry = selectSuggestedCountry(state)
      if (suggestedCountry && !country && !phone.length) {
        setCountry(suggestedCountry)
        setPhone(suggestedCountry?.dial_code)
      }
    }
  }, [state.auth.connection, state.settings.i18n.countries])

  const handleChangePhone = useCallback(
    (phone: string) => {
      const country = state.settings.i18n.countries.find(
        (country) => country.dial_code === phone.trim()
      )

      if (country) {
        setCountry(country)
        setPhone(phone)
      } else {
        setPhone(phone)
      }
    },
    [state.settings.i18n.countries]
  )
  const handleSelectCountry = useCallback(
    (country: Country) => {
      setCountry(country)
      setTimeout(() => {
        phoneInputRef.current?.focus()
      }, 250)
      setPhone(country.dial_code)
    },
    [phoneInputRef]
  )

  const handleChangeLanguage = async () => {
    if (state.settings.suggestedLanguage) {
      await changeLanguage(state.settings.suggestedLanguage)
    }
  }

  const handleChangeRememberMe = useCallback((checked: boolean) => {
    updateGlobalState({
      auth: {
        rememberMe: checked
      }
    })
  }, [])

  const isValidPhone = useMemo(() => IS_PHONE_VAL_REG.test(phone.trim()), [phone])

  const translateString = useTranslateString(
    'Auth.ContinueOnLanguage',
    state.settings.suggestedLanguage
  )

  const handleSubmit = async (e: TargetedEvent<HTMLFormElement, Event>) => {
    e.preventDefault()

    sendPhone(phone)
  }
  return (
    <>
      <Logo />
      <h1 class="title text-center">{t('Auth.Signin')}</h1>
      <p class="subtitle text-center">{t('Auth.ConfirmNumber')}</p>
      <form onSubmit={handleSubmit}>
        <SelectCountryInput
          loading={!state.settings.i18n.countries.length || !state.auth.connection}
          countryList={state.settings.i18n.countries}
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
          label={t('RememberMe')}
          onToggle={handleChangeRememberMe}
          checked={state.auth.$rememberMe!}
        />
        {isValidPhone && (
          <Button type="submit" isLoading={state.auth.loading}>
            {t('Next')}
          </Button>
        )}

        {translateString && state.settings.suggestedLanguage !== state.settings.i18n.lang_code && (
          <Button variant="transparent" onClick={handleChangeLanguage}>
            {translateString}
          </Button>
        )}
      </form>
    </>
  )
}

export default memo(AuthPhoneNumber)
