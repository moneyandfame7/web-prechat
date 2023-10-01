import {type FC, memo} from 'preact/compat'

import {SettingsContext} from 'context/settings'

import {ColumnWrapper} from 'components/ColumnWrapper'

const SettingsEditProfile: FC = () => {
  const {resetScreen} = SettingsContext.useScreenContext()
  return (
    <ColumnWrapper title="Edit profile" onGoBack={resetScreen}>
      <h1>Edit profile</h1>
    </ColumnWrapper>
  )
}

export default memo(SettingsEditProfile)
