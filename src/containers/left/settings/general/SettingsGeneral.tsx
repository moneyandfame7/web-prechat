import {type FC, memo} from 'preact/compat'

import {SettingsContext} from 'context/settings'

import {ColumnWrapper} from 'components/ColumnWrapper'

const SettingsGeneral: FC = () => {
  const {resetScreen} = SettingsContext.useScreenContext()

  return (
    <ColumnWrapper title="General" onGoBack={resetScreen}>
      <h1>General</h1>
    </ColumnWrapper>
  )
}

export default memo(SettingsGeneral)
