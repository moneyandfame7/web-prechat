import { changeLanguage } from 'lib/i18n'
import { FC, TargetedEvent, useCallback } from 'preact/compat'
import { LANGUAGES_LIST } from 'state/helpers/settings'
import { getGlobalState } from 'state/signal'
import { SupportedLanguages } from 'types/lib'

export const SwitchLanguageTest: FC = () => {
  const language = getGlobalState((state) => state.settings.i18n.lang_code)
  const handleSelectLanguage = useCallback((e: TargetedEvent<HTMLSelectElement, Event>) => {
    changeLanguage(e.currentTarget.value as SupportedLanguages)
  }, [])
  return (
    <select value={language} onChange={handleSelectLanguage}>
      {LANGUAGES_LIST.map((lng) => (
        <option value={lng.value}>{lng.label}</option>
      ))}
    </select>
  )
}
