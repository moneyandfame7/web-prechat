import { FC, TargetedEvent, useCallback } from 'preact/compat'

import {
  changeLanguage,
  getCurrentLanguage,
  getLanguagesList,
  t
} from 'state/i18n'
import { SupportedLanguages } from 'state/i18n/types'

const LanguageSwitch: FC = () => {
  const handleChangeLanguage = useCallback(
    (e: TargetedEvent<HTMLSelectElement, Event>) => {
      const { value } = e.currentTarget

      changeLanguage(value as SupportedLanguages)
    },
    []
  )
  const $language = getCurrentLanguage()
  const $languagesList = getLanguagesList()
  return (
    <>
      <h1>TRANSLATED: {t('Hello')}</h1>
      <select onChange={handleChangeLanguage} value={$language}>
        {$languagesList.value.map((lng) => (
          <option value={lng.value}>{lng.label}</option>
        ))}
      </select>
    </>
  )
}

export { LanguageSwitch }
