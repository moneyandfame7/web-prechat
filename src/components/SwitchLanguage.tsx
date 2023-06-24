import type { FC, TargetedEvent } from 'preact/compat'

import { setLanguage } from 'lib/i18n'
import type { SupportedLanguages } from 'types/lib'

import { LANGUAGES_LIST } from 'state/helpers/settings'

export const SwitchLanguage: FC = () => {
  const handleOnChange = async (e: TargetedEvent<HTMLSelectElement, Event>) => {
    await setLanguage(e.currentTarget.value as SupportedLanguages)
  }
  return (
    <select onChange={handleOnChange}>
      {LANGUAGES_LIST.map((lng) => (
        <option value={lng.value}>{lng.label}</option>
      ))}
    </select>
  )
}
