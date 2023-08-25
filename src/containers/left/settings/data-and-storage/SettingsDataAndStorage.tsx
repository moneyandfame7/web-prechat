import {type FC, memo} from 'preact/compat'

import {SettingsContext} from 'context/settings'

import {ColumnWrapper} from 'components/ColumnWrapper'

const SettingsDataAndStorage: FC = () => {
  const {resetScreen} = SettingsContext.useScreenContext()
  return (
    <>
      <ColumnWrapper title="Language" onGoBack={resetScreen}>
        <h1>Data and storage</h1>
      </ColumnWrapper>
    </>
  )
}

export default memo(SettingsDataAndStorage)
