import type {FC} from 'preact/compat'
import {memo, useCallback, useMemo, useState} from 'preact/compat'

import {
  SwitchTransition,
  type TransitionCases,
  // ZOOM_SLIDE_IN,
  // ZOOM_SLIDE_OUT,
  ZOOM_SLIDE_IN,
  ZOOM_SLIDE_OUT
} from 'components/transitions'
import {SettingsContext} from 'context/settings'

import {SettingsGroup, SettingsScreens, getSettingsActiveGroup} from 'types/screens'

import SettingsChatFolders from './chat-folders/SettingsChatFolders.async'
import SettingsDataAndStorage from './data-and-storage/SettingsDataAndStorage.async'
import SettingsDevices from './devices/SettingsDevices.async'
import SettingsGeneral from './general/SettingsGeneral.async'
import SettingsLanguage from './language/SettingsLanguage.async'
import SettingsMain from './main/SettingsMain.async'
import SettingsNotifications from './notifications/SettingsNotifications.async'
import SettingsPrivacy from './privacy/SettingsPrivacy.async'
import SettingsEditProfile from './edit-profile/SettingsEditProfile.async'
import SettingsAppearance from './appearance/SettingsAppearance.async'

import './Settings.scss'

const getTransitionByCase = (
  _: SettingsGroup,
  previousScreen?: SettingsGroup
): TransitionCases => {
  if (previousScreen === SettingsGroup.Main) {
    return ZOOM_SLIDE_IN
  }

  return ZOOM_SLIDE_OUT
}

const classNames: Record<SettingsGroup, string> = {
  [SettingsGroup.EditProfile]: 'Settings-EditProfile',
  [SettingsGroup.Main]: 'Settings-Main',
  [SettingsGroup.ChatFolders]: 'Settings-ChatFolders',
  [SettingsGroup.Devices]: 'Settings-Devices',
  [SettingsGroup.DataAndStorage]: 'Settings-DataAndStorage',
  [SettingsGroup.General]: 'Settings-General',
  [SettingsGroup.Language]: 'Settings-Language',
  [SettingsGroup.Notifications]: 'Settings-Notifications',
  [SettingsGroup.Privacy]: 'Settings-Privacy',
  [SettingsGroup.Appearance]: 'Settings-Appearance'
}

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
        setScreen: setActiveScreen
      }}
    >
      {/* <div class="LeftColumn-Header">Settings</div> */}
      <SwitchTransition
        getTransitionByCase={getTransitionByCase}
        activeKey={activeGroup}
        name="fade"
        // durations={250}
        classNames={classNames}
        shouldCleanup
        cleanupException={[SettingsGroup.Main]}
        permanentClassname="Screen-container"
      >
        {renderScreen()}
      </SwitchTransition>
    </SettingsContext.Provider>
  )
}

export default memo(Settings)
