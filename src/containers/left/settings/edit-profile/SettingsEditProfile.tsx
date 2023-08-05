import {type FC, memo} from 'preact/compat'

import {IconButton} from 'components/ui'

import {SettingsContext} from 'context/settings'

const SettingsEditProfile: FC = () => {
  const {resetScreen} = SettingsContext.useScreenContext()
  return (
    <>
      <div class="LeftColumn-Header">
        <IconButton icon="arrowLeft" onClick={resetScreen} />
        <p class="LeftColumn-Header_title">Edit Profile</p>
      </div>
      <h1>SettingsEditProfile</h1>
    </>
  )
}

export default memo(SettingsEditProfile)
