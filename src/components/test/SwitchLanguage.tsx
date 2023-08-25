import {changeLanguage} from 'lib/i18n'
import {type FC, type TargetedEvent, useCallback} from 'preact/compat'
import {LANGUAGES_LIST} from 'state/helpers/settings'
import {getGlobalState} from 'state/signal'
import type {ApiLangCode} from 'types/lib'

export const SwitchLanguageTest: FC = () => {
  const language = getGlobalState(state => state.settings.i18n.lang_code)
  const handleSelectLanguage = useCallback((e: TargetedEvent<HTMLSelectElement, Event>) => {
    changeLanguage(e.currentTarget.value as ApiLangCode)
  }, [])
  return (
    <select value={language} onChange={handleSelectLanguage}>
      {LANGUAGES_LIST.map(lng => (
        <option key={lng.value} value={lng.value}>
          {lng.label}
        </option>
      ))}
    </select>
  )
}
