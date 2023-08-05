import {type FC, memo} from 'preact/compat'

import {SettingsContext} from 'context/settings'
import {IconButton} from 'components/ui'

const SettingsAppearance: FC = () => {
  const {resetScreen} = SettingsContext.useScreenContext()

  return (
    <>
      <div class="LeftColumn-Header">
        <IconButton icon="arrowLeft" onClick={resetScreen} />
        <p class="LeftColumn-Header_title">Appearance</p>
      </div>
      <h1>SettingsAppearance</h1>
    </>
  )
}

export default memo(SettingsAppearance)
