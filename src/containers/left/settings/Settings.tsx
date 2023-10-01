import {type FC, memo, useCallback, useState} from 'preact/compat'

import {SettingsContext} from 'context/settings'

import {connect} from 'state/connect'
import {getPreferredAnimations} from 'state/helpers/settings'

import {usePrevious} from 'hooks'

import {MOCK_TWO_FA} from 'common/app'

import {SettingsScreens, getSettingsActiveGroup} from 'types/screens'
import type {TwoFaState} from 'types/state'

import {Transition} from 'components/transitions'

import {SettingsTwoFa} from './2fa'
import {SettingsTwoFaEmail} from './2fa/email'
import {SettingsTwoFaEmailConfirmation} from './2fa/emailConfirmation'
import {SettingsTwoFaEnterPassword} from './2fa/enterPassword'
import {SettingsTwoFaHint} from './2fa/hint'
import {SettingsTwoFaPasswordSet} from './2fa/passwordSet'
import {SettingsTwoFaReEnterPassword} from './2fa/reEnterPassword'
import {BlockedUsers} from './blockedUsers'
import SettingsChatFolders from './chatFolders'
import SettingsChatFolderEdit from './chatFolders/editFolder'
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

  // const activeGroup = getSettingsActiveGroup(activeScreen)
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
      case SettingsScreens.TwoFa:
        setActiveScreen(SettingsScreens.Privacy)
        break
      case SettingsScreens.ChatFoldersEdit:
        setActiveScreen(SettingsScreens.ChatFolders)
        break
      default:
        setActiveScreen(SettingsScreens.Main)
    }
  }

  const renderScreen = () => {
    switch (activeScreen) {
      case SettingsScreens.ChatFolders:
        return <SettingsChatFolders />
      case SettingsScreens.ChatFoldersEdit:
        return <SettingsChatFolderEdit />
      case SettingsScreens.DataAndStorage:
        return <SettingsDataAndStorage />
      case SettingsScreens.Devices:
        return <SettingsDevices />
      case SettingsScreens.General:
        return <SettingsGeneral />
      case SettingsScreens.Language:
        return <SettingsLanguage />
      case SettingsScreens.Main:
        return <SettingsMain />
      case SettingsScreens.EditProfile:
        return <SettingsEditProfile />
      case SettingsScreens.Notifications:
        return <SettingsNotifications />
      case SettingsScreens.Privacy:
        return <SettingsPrivacy />
      case SettingsScreens.TwoFa:
        return <SettingsTwoFa />
      case SettingsScreens.TwoFaEnterPassword:
        return <SettingsTwoFaEnterPassword />
      case SettingsScreens.TwoFaReEnterPassword:
        return <SettingsTwoFaReEnterPassword />
      case SettingsScreens.TwoFaEmail:
        return <SettingsTwoFaEmail />
      case SettingsScreens.TwoFaEmailConfirmation:
        return <SettingsTwoFaEmailConfirmation />
      case SettingsScreens.TwoFaPasswordHint:
        return <SettingsTwoFaHint />
      case SettingsScreens.TwoFaPasswordSet:
        return <SettingsTwoFaPasswordSet />
      case SettingsScreens.BlockedUsers:
        return <BlockedUsers />
    }
  }

  const prevScreen = usePrevious(activeScreen)

  // not work??
  const testDir =
    MOCK_TWO_FA.value &&
    activeScreen === SettingsScreens.TwoFa &&
    prevScreen === SettingsScreens.TwoFaEnterPassword
      ? 1
      : 'auto'
  return (
    <SettingsContext.Provider
      store={{
        resetScreen: handleReset,
        activeScreen,
        setScreen: setActiveScreen,
      }}
    >
      <Transition
        direction={testDir}
        containerClassname="settings-wrapper"
        // name={APP_TRANSITION_NAME} // is mobile? slideDark : zoomSlide
        innerClassnames={{
          [SettingsScreens.General]: 'settings-general',
          [SettingsScreens.ChatFolders]: 'chat-folders',
          [SettingsScreens.TwoFa]: 'two-fa two-fa-main',
          [SettingsScreens.TwoFaEnterPassword]: 'two-fa two-fa-enter-password',
          [SettingsScreens.TwoFaReEnterPassword]: 'two-fa two-fa-enter-password',
          [SettingsScreens.TwoFaPasswordHint]: 'two-fa two-fa-hint',
          [SettingsScreens.TwoFaEmail]: 'two-fa two-fa-email',
          [SettingsScreens.TwoFaPasswordSet]: 'two-fa',
        }}
        // direction={testDir}
        name={getPreferredAnimations().page}
        activeKey={activeScreen}
        shouldCleanup={false} // @todo зробити для cleanupElements
        shouldLockUI
        // cleanupException={}
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
