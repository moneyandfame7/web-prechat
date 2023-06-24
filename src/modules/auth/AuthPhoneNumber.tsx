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

import { setLanguage, t, useTranslateForString } from 'lib/i18n'

import { getActions } from 'state/action'
import { getGlobalState } from 'state/signal'
import { selectSuggestedCountry } from 'state/selectors/auth'

import { AuthScreens } from 'types/state'
import type { Country } from 'types/api'

import { Button } from 'components/Button'
import { Checkbox } from 'components/Checkbox'
import { Logo } from 'components/Logo'

import { PhoneNumberInput } from './PhoneNumberInput'
import { SelectCountryInput } from './SelectCountryInput'

import './AuthPhoneNumber.scss'

const IS_PHONE_VAL_REG = /^\+\d{1,4}\s?\d{7,}$/

const AuthPhoneNumber: FC = () => {
  const { getCountries, sendPhone, changeAuthScreen } = getActions()
  const state = getGlobalState()
  const phoneInputRef = useRef<HTMLInputElement>(null)

  const [phone, setPhone] = useState<string>('+380684178101')
  const [country, setCountry] = useState<Country | undefined>()

  useEffect(() => {
    getCountries(state.settings.language)
  }, [state.settings.language])

  useEffect(() => {
    if (state.auth.connection && state.countryList.length) {
      const suggestedCountry = selectSuggestedCountry(state)
      if (suggestedCountry && !country && !phone.length) {
        setCountry(suggestedCountry)
        setPhone(suggestedCountry?.dial_code)
      }
    }
  }, [state.auth.connection, state.countryList])

  useEffect(() => {
    if (state.auth.phoneNumber) {
      changeAuthScreen(AuthScreens.Code)
    }
  }, [state.auth.phoneNumber])

  const handleChangePhone = useCallback(
    (phone: string) => {
      const country = state.countryList.find((country) => country.dial_code === phone.trim())

      if (country) {
        setCountry(country)
        setPhone(phone)
      } else {
        setPhone(phone)
      }
    },
    [state.countryList]
  )

  const handleSelectCountry = useCallback(
    (country: Country) => {
      setCountry(country)
      setTimeout(() => {
        phoneInputRef.current?.focus()
      }, 250)
      setPhone(country.dial_code)
    },
    [phone, phoneInputRef]
  )

  const handleChangeLanguage = async () => {
    if (state.settings.suggestedLanguage) {
      await setLanguage(state.settings.suggestedLanguage)
    }
  }

  const handleChangeRememberMe = useCallback(() => {
    state.auth.rememberMe = !state.auth.rememberMe
  }, [state.auth.rememberMe])

  const isValidPhone = useMemo(() => IS_PHONE_VAL_REG.test(phone.trim()), [phone])

  const translateString = useTranslateForString(
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
      <Button
        onClick={() => {
          changeAuthScreen(AuthScreens.SignUp)
        }}
      >
        Alo
      </Button>
      <h1 class="title text-center">{t('Auth.Signin')}</h1>
      <p class="subtitle text-center">{t('Auth.ConfirmNumber')}</p>
      <form onSubmit={handleSubmit}>
        <SelectCountryInput
          loading={!state.countryList?.length || !state.auth.connection}
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
          label="Remember me"
          onToggle={handleChangeRememberMe}
          checked={state.auth.rememberMe}
        />
        {isValidPhone && (
          <Button type="submit" isLoading={state.auth.loading}>
            {t('Next')}
          </Button>
        )}

        {translateString && state.settings.suggestedLanguage !== state.settings.language && (
          <Button variant="transparent" onClick={handleChangeLanguage}>
            {translateString}
          </Button>
        )}
      </form>
    </>
  )
}

export default memo(AuthPhoneNumber)
