import {type FC, memo} from 'preact/compat'

import {SettingsContext} from 'context/settings'

import {ColumnWrapper} from 'components/ColumnWrapper'

const SettingsDevices: FC = () => {
  const {resetScreen} = SettingsContext.useScreenContext()
  return (
    <>
      <ColumnWrapper title="Active sessions" onGoBack={resetScreen}>
        <h1>Devices</h1>
      </ColumnWrapper>
    </>
  )
}

export default memo(SettingsDevices)
