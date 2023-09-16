import {type FC, memo, useCallback, useMemo, useState} from 'preact/compat'

import {SettingsContext} from 'context/settings'

import {APP_TRANSITION_NAME} from 'common/config'

import {SettingsGroup, SettingsScreens, getSettingsActiveGroup} from 'types/screens'

import {Transition} from 'components/transitions'

import SettingsAppearance from './appearance/SettingsAppearance.async'
import SettingsChatFolders from './chat-folders/SettingsChatFolders.async'
import SettingsDataAndStorage from './data-and-storage/SettingsDataAndStorage.async'
import SettingsDevices from './devices/SettingsDevices.async'
import SettingsEditProfile from './edit-profile/SettingsEditProfile.async'
import SettingsGeneral from './general/SettingsGeneral.async'
import SettingsLanguage from './language/SettingsLanguage.async'
import SettingsMain from './main/SettingsMain.async'
import SettingsNotifications from './notifications/SettingsNotifications.async'
import SettingsPrivacy from './privacy/SettingsPrivacy.async'

import './Settings.scss'

export interface SettingsProps {
  currentScreen: SettingsScreens
}
const Settings: FC<SettingsProps> = ({currentScreen}) => {
  const [activeScreen, setActiveScreen] = useState(currentScreen)

  const activeGroup = useMemo(() => getSettingsActiveGroup(activeScreen), [activeScreen])
  const handleReset = (force?: boolean) => {
    if (force) {
      setActiveScreen(SettingsScreens.Main)
      return
    }
    switch (currentScreen) {
      case SettingsScreens.ChatFolders:
      case SettingsScreens.DataAndStorage:
      case SettingsScreens.Devices:
      case SettingsScreens.General:
      case SettingsScreens.Language:
      case SettingsScreens.Main:
      case SettingsScreens.Notifications:
      case SettingsScreens.Privacy:
      case SettingsScreens.Appearance:
        setActiveScreen(SettingsScreens.Main)
        break
    }
  }
  const renderScreen = useCallback(() => {
    switch (activeGroup) {
      case SettingsGroup.ChatFolders:
        return <SettingsChatFolders />
      case SettingsGroup.DataAndStorage:
        return <SettingsDataAndStorage />
      case SettingsGroup.Devices:
        return <SettingsDevices />
      case SettingsGroup.General:
        return <SettingsGeneral />
      case SettingsGroup.Language:
        return <SettingsLanguage />
      case SettingsGroup.Main:
        return <SettingsMain />
      case SettingsGroup.EditProfile:
        return <SettingsEditProfile />
      case SettingsGroup.Notifications:
        return <SettingsNotifications />
      case SettingsGroup.Privacy:
        return <SettingsPrivacy />
      case SettingsGroup.Appearance:
        return <SettingsAppearance />
    }
  }, [activeGroup])

  return (
    <SettingsContext.Provider
      store={{
        resetScreen: handleReset,
        activeScreen,
        setScreen: setActiveScreen,
      }}
    >
      <Transition
        containerClassname="settings-wrapper"
        name={APP_TRANSITION_NAME} // is mobile? slideDark : zoomSlide
        activeKey={activeGroup}
        shouldCleanup
        cleanupException={SettingsGroup.Main}
        shouldLockUI
      >
        {renderScreen()}
      </Transition>
    </SettingsContext.Provider>
  )
}

export default memo(Settings)
