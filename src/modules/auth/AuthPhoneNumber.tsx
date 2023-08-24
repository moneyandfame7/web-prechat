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

import {getActions} from 'state/action'

import './AuthPhoneNumber.scss'

const AuthPhoneNumber: FC = () => {
  const global = getGlobalState()
  const {authInit, getCountries, sendPhone} = getActions()
  // const {getCountries} = getActions()
  const phoneInputRef = useRef<HTMLInputElement>(null)

  const phone = useSignal('')
  const isFormDisabled = useComputed(() => !validatePhone(unformatStr(phone.value)))

  const [country, setCountry] = useState<ApiCountry | undefined>()
  const translateLoading = useSignal(false)
  const translateString = useTranslateString(
    'Auth.ContinueOnLanguage',
    global.settings.suggestedLanguage
  )
  useLayoutEffect(() => {
    // initializeAuth()
    // appManager.appAuthManager.init()
    authInit()
  }, [])
  useEffect(() => {
    getCountries(global.settings.language)
  }, [global.settings.language])

  useEffect(() => {
    const suggested = global.countryList.find((c) => c.dial_code === country?.dial_code)
    setCountry(suggested)
  }, [global.countryList])
  useEffect(() => {
    if (global.auth.connection && global.countryList.length) {
      const suggestedCountry = selectSuggestedCountry(global)
      if (suggestedCountry && !country && !phone.value.length) {
        setCountry(suggestedCountry)
        phone.value = suggestedCountry.dial_code
      }
    }
  }, [global.auth.connection, global.countryList])

  const handleChangePhone = useCallback(
    (value: string) => {
      const foundedCountry = global.countryList.find(
        (country) => country.dial_code === value.trim()
      )

      if (foundedCountry) {
        setCountry(foundedCountry)
      }
      phone.value = value /* .replace(/\s/g, '') */
    },
    [global.countryList, country]
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
    const suggestedLng = global.settings.suggestedLanguage
    if (suggestedLng) {
      translateLoading.value = true
      await changeLanguage(suggestedLng)

      translateLoading.value = false
    }
  }, [global.settings.suggestedLanguage])

  const handleChangeRememberMe = useCallback((checked: boolean) => {
    // state.auth.rememberMe = checked
    global.auth.rememberMe = checked
  }, [])

  const handleSubmit = (e: TargetedEvent<HTMLFormElement, Event>) => {
    e.preventDefault()

    // console.log(phone.value)
    sendPhone(phone.value)
    // appActions.auth.sendPhone(phone.value)
  }

  return (
    <>
      <Logo />
      <h1 class="title">{t('Auth.Signin')}</h1>
      <p class="subtitle">{t('Auth.ConfirmNumber')}</p>
      <form onSubmit={handleSubmit}>
        <SelectCountryInput
          loading={/* !state.countryList.length || */ !global.auth.connection}
          countryList={global.countryList}
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
          disabled={global.auth.isLoading}
          /* якщо тут передати не сигнал, буде ререндер всього компоненту */
          checked={global.auth.$rememberMe!}
        />
        <Button
          type="submit"
          isLoading={global.auth.isLoading}
          isDisabled={isFormDisabled}
        >
          {global.auth.error || t('Next')}
        </Button>

        {global.settings.suggestedLanguage !== global.settings.i18n.lang_code && (
          <Button
            variant="transparent"
            onClick={handleChangeLanguage}
            isLoading={translateLoading.value}
            isDisabled={global.auth.$isLoading}
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
