import {type FC, memo} from 'preact/compat'

import {SettingsContext} from 'context/settings'

import {ColumnWrapper} from 'components/ColumnWrapper'

const SettingsPrivacy: FC = () => {
  const {resetScreen} = SettingsContext.useScreenContext()
  return (
    <ColumnWrapper title="Privacy" onGoBack={resetScreen}>
      <h1>Notifications</h1>
    </ColumnWrapper>
  )
}

export default memo(SettingsPrivacy)
