import {type FC, memo} from 'preact/compat'

import {SettingsContext} from 'context/settings'

import {ColumnWrapper} from 'components/ColumnWrapper'

const SettingsAppearance: FC = () => {
  const {resetScreen} = SettingsContext.useScreenContext()
  return (
    <ColumnWrapper title="Language" onGoBack={resetScreen}>
      <h1>Appearance</h1>
    </ColumnWrapper>
  )
}

export default memo(SettingsAppearance)
