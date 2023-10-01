import {type FC, type TargetedEvent, useCallback, useRef} from 'preact/compat'

import type {ApiLangCode} from 'api/types'

import {LANGUAGES_LIST} from 'state/helpers/settings'
import {getGlobalState} from 'state/signal'

import {TEST_changeLanguage, TEST_translate} from 'lib/i18n'

import {renderText} from 'utilities/parse/render'

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
      {language}
      <h4>CHANGE (renderCount: {render.current})</h4>
      <select value={language} onChange={handleSelectLanguage}>
        {LANGUAGES_LIST.map((lng) => (
          <option key={lng.value} value={lng.value}>
            {lng.label}
          </option>
        ))}
      </select>
      <Divider>KEYS:</Divider>

      <h5>
        {renderText(
          TEST_translate('HelloInterpolate', {
            name: 'Davyd',
          }),
          ['markdown']
        )}
      </h5>
    </>
  )
}
