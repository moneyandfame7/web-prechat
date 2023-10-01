import {type FC, memo} from 'preact/compat'

import {SettingsContext} from 'context/settings'

import {ColumnWrapper} from 'components/ColumnWrapper'

const SettingsNotifications: FC = () => {
  const {resetScreen} = SettingsContext.useScreenContext()
  return (
    <ColumnWrapper title="Notifications" onGoBack={resetScreen}>
      <h1>Notifications</h1>
    </ColumnWrapper>
  )
}

export default memo(SettingsNotifications)
