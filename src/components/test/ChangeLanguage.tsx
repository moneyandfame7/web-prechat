import {type FC, type TargetedEvent, useCallback, useRef} from 'preact/compat'

import type {ApiLangCode} from 'api/types'

import {LANGUAGES_LIST} from 'state/helpers/settings'
import {getGlobalState} from 'state/signal'

import {t} from 'lib/i18n'
import {parseStringToJSX} from 'lib/i18n/helpers'
import {TEST_changeLanguage, TEST_translate} from 'lib/i18n/types'

import {Divider} from 'components/ui'

export const TEST_ChangeLanguage: FC = () => {
  const language = getGlobalState((state) => state.settings.i18n.lang_code)
  const handleSelectLanguage = useCallback((e: TargetedEvent<HTMLSelectElement, Event>) => {
    TEST_changeLanguage(e.currentTarget.value as ApiLangCode)
  }, [])
  const render = useRef(0)

  render.current += 1
  return (
    <>
      <h4>CHANGE (renderCount: {render.current})</h4>
      <select value={language} onChange={handleSelectLanguage}>
        {LANGUAGES_LIST.map((lng) => (
          <option key={lng.value} value={lng.value}>
            {lng.label}
          </option>
        ))}
      </select>
      <Divider>KEYS:</Divider>
      {TEST_translate('YourName')} | {TEST_translate('Auth.ContinueOnLanguage')} |{' '}
      {TEST_translate('HelloInterpolate', {name: 'EBAL TVOI ROTIK :)'})} |{' '}
      {parseStringToJSX(TEST_translate('CombinedPlurAndInter', {count: 888, name: 'DAVYDKA'}))}
      {/* {parseStringToJSX(TEST_translate('HelloPluralize', {count: 228}).value)} */}
    </>
  )
}
