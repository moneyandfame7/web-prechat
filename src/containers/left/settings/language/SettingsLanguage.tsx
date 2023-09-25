import {type FC, memo, useCallback, useEffect, useMemo, useState} from 'preact/compat'

import {SettingsContext} from 'context/settings'

import type {ApiLangCode, ApiLanguage} from 'api/types'

import {getActions} from 'state/action'
import {connect} from 'state/connect'

import {TEST_changeLanguage} from 'lib/i18n'

import {timeout} from 'utilities/schedulers/timeout'

import {ColumnSection} from 'containers/left/ColumnSection'

import {ColumnWrapper} from 'components/ColumnWrapper'
import {Checkbox} from 'components/ui'
import {RadioGroup, type RadioGroupItem} from 'components/ui/RadioGroup'

interface StateProps {
  languages: ApiLanguage[]
  suggestedLanguage?: ApiLangCode
  currentLanguage: ApiLangCode
  showTranslate: boolean
}

const mapLanguageToItem = (language: ApiLanguage) => ({
  title: language.nativeName,
  subtitle: language.name,
  value: language.langCode,
})
function prepareForRadioGroup(
  languages: ApiLanguage[],
  suggestedLanguage?: ApiLangCode
): RadioGroupItem[] {
  if (!suggestedLanguage) {
    return languages.map(mapLanguageToItem)
  }

  const currentLanguage = languages.find((l) => l.langCode === suggestedLanguage)

  if (!currentLanguage) {
    return languages.map(mapLanguageToItem)
  }

  return [
    mapLanguageToItem(currentLanguage),
    ...languages.filter((l) => l.langCode !== currentLanguage.langCode).map(mapLanguageToItem),
  ]
}

const SettingsLanguage: FC<StateProps> = ({
  languages,
  suggestedLanguage,
  showTranslate,
  currentLanguage,
}) => {
  const {resetScreen} = SettingsContext.useScreenContext()
  const {getLanguages, changeSettings} = getActions()
  const [picked, setPicked] = useState(currentLanguage)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!languages?.length) {
      getLanguages()
    }
  }, [])

  const handleChange = async (v: string) => {
    setLoading(true)
    setPicked(v as ApiLangCode)
    await TEST_changeLanguage(v as ApiLangCode)

    setTimeout(() => {
      setLoading(false)
    }, 200)
  }

  const toggleShowTranslate = useCallback((checked: boolean) => {
    changeSettings({
      showTranslate: checked,
    })
  }, [])

  const radioGroupLanguages: RadioGroupItem[] = useMemo(
    () => prepareForRadioGroup(languages, suggestedLanguage),
    [languages, suggestedLanguage]
  )
  return (
    <ColumnWrapper title="Language" onGoBack={resetScreen}>
      <ColumnSection>
        <Checkbox
          checked={showTranslate}
          label='Показувати кнопку "Перекласти"'
          onToggle={toggleShowTranslate}
        />

        <p class="text-secondary mt-20">
          Опція перекладу зʼявиться при натисканні на повідомленні правою кнопкою миші.
        </p>
      </ColumnSection>
      {/* @todo suggested language in TOP */}
      <ColumnSection title="Мова інтерфейсу">
        <RadioGroup
          loadingFor={loading ? picked : undefined}
          values={radioGroupLanguages}
          value={picked}
          onChange={handleChange}
        />
      </ColumnSection>
    </ColumnWrapper>
  )
}

export default memo(
  connect(
    (state): StateProps => ({
      languages: state.settings.languages,
      suggestedLanguage: state.settings.suggestedLanguage,
      showTranslate: state.settings.showTranslate,
      currentLanguage: state.settings.language,
    })
  )(SettingsLanguage)
)
