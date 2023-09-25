import {type FC, memo, useCallback, useState} from 'preact/compat'

import {SettingsContext} from 'context/settings'

import {connect} from 'state/connect'
import {getPreferredAnimations} from 'state/helpers/settings'

import {usePrevious} from 'hooks'

import {MOCK_TWO_FA} from 'common/app'

import {SettingsGroup, SettingsScreens, getSettingsActiveGroup} from 'types/screens'
import type {TwoFaState} from 'types/state'

import {Transition} from 'components/transitions'

import SettingsTwoFa from './2fa'
import {BlockedUsers} from './blockedUsers'
import SettingsChatFolders from './chat-folders/SettingsChatFolders'
import SettingsDataAndStorage from './data-and-storage/SettingsDataAndStorage'
import SettingsDevices from './devices/SettingsDevices'
import SettingsEditProfile from './edit-profile/SettingsEditProfile'
import SettingsGeneral from './general/SettingsGeneral'
import SettingsLanguage from './language/SettingsLanguage'
import SettingsMain from './main/SettingsMain'
import SettingsNotifications from './notifications/SettingsNotifications'
import SettingsPrivacy from './privacy/SettingsPrivacy'

import './Settings.scss'

export interface SettingsProps {
  currentScreen: SettingsScreens
}

interface StateProps {
  twoFaState: TwoFaState
}
const Settings: FC<SettingsProps & StateProps> = ({currentScreen, twoFaState}) => {
  const [activeScreen, setActiveScreen] = useState(currentScreen)

  const activeGroup = getSettingsActiveGroup(activeScreen)
  const handleReset = (force?: boolean) => {
    if (force === true) {
      setActiveScreen(SettingsScreens.Main)
      return
    }
    switch (activeScreen) {
      case SettingsScreens.TwoFaEnterPassword: {
        // if (twoFaState.hasPassword && twoFaState.newPassword) {
        //   setActiveScreen(SettingsScreens.TwoFaMain)
        // } else if (twoFaState.hasPassword) {
        //   setActiveScreen(SettingsScreens.Privacy)
        // }
        setActiveScreen(SettingsScreens.Privacy)
        // if (MOCK_TWO_FA.value || twoFaState.hasPassword) {
        //   setActiveScreen(SettingsScreens.Privacy)
        // }else{}

        break
      }

      case SettingsScreens.TwoFaReEnterPassword:
        setActiveScreen(SettingsScreens.TwoFaEnterPassword)
        break
      case SettingsScreens.TwoFaEmail:
        setActiveScreen(SettingsScreens.TwoFaPasswordHint)
        break
      case SettingsScreens.TwoFaPasswordHint:
        setActiveScreen(SettingsScreens.TwoFaReEnterPassword)
        break
      case SettingsScreens.BlockedUsers:
      case SettingsScreens.TwoFaPasswordSet:
      case SettingsScreens.TwoFaMain:
        setActiveScreen(SettingsScreens.Privacy)
        break
      default:
        setActiveScreen(SettingsScreens.Main)
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
      case SettingsGroup.TwoFa:
        return <SettingsTwoFa />
      case SettingsGroup.BlockedUsers:
        return <BlockedUsers />
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
        // name={APP_TRANSITION_NAME} // is mobile? slideDark : zoomSlide
        innerClassnames={{
          [SettingsGroup.General]: 'settings-general',
        }}
        name={getPreferredAnimations().page}
        activeKey={activeGroup}
        shouldCleanup // @todo зробити для cleanupElements
        shouldLockUI
      >
        {renderScreen()}
      </Transition>
    </SettingsContext.Provider>
  )
}

export default memo(
  connect<SettingsProps, StateProps>((state) => ({
    twoFaState: state.twoFa,
  }))(Settings)
)
