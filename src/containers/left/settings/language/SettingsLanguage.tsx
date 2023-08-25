import {type FC, memo} from 'preact/compat'

import {SettingsContext} from 'context/settings'

import {ColumnWrapper} from 'components/ColumnWrapper'

const SettingsLanguage: FC = () => {
  const {resetScreen} = SettingsContext.useScreenContext()
  return (
    <ColumnWrapper title="Language" onGoBack={resetScreen}>
      <h1>SettingsLanguage</h1>
    </ColumnWrapper>
  )
}

export default memo(SettingsLanguage)
