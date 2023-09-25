import {type FC, memo} from 'preact/compat'

import {SettingsContext} from 'context/settings'

import {getPreferredAnimations} from 'state/helpers/settings'

import {usePrevious} from 'hooks'

import {MOCK_TWO_FA} from 'common/app'

import {SettingsScreens, isTwoFaScreen} from 'types/screens'

import {Transition} from 'components/transitions'

import {SettingsTwoFaEmail} from './email'
import {SettingsTwoFaEmailConfirmation} from './emailConfirmation'
import {SettingsTwoFaEnterPassword} from './enterPassword'
import {SettingsTwoFaHint} from './hint'
import {SettingsTwoFaMain} from './main'
import {SettingsTwoFaPasswordSet} from './passwordSet'
import {SettingsTwoFaReEnterPassword} from './reEnterPassword'

import './styles.scss'

const SettingsTwoFa: FC = () => {
  const {activeScreen} = SettingsContext.useScreenContext()
  // const [activeScreen, setActiveScreen] = useState<TwoFaScreens>(() =>
  // MOCK_TWO_FA.value ? TwoFaScreens.EnterPassword : TwoFaScreens.Main
  // )
  // let twoFaScreen:Two

  const renderScreen = () => {
    switch (activeScreen) {
      case SettingsScreens.TwoFaMain:
        return <SettingsTwoFaMain />
      case SettingsScreens.TwoFaEmail:
        return <SettingsTwoFaEmail />
      case SettingsScreens.TwoFaEmailConfirmation:
        return <SettingsTwoFaEmailConfirmation />

      // case TwoFaScreens.EmailCode:
      //   return <SettingsTwoFaEmailCode />
      case SettingsScreens.TwoFaEnterPassword:
        return <SettingsTwoFaEnterPassword />
      case SettingsScreens.TwoFaReEnterPassword:
        return <SettingsTwoFaReEnterPassword />
      case SettingsScreens.TwoFaPasswordHint:
        return <SettingsTwoFaHint />
      case SettingsScreens.TwoFaPasswordSet:
        return <SettingsTwoFaPasswordSet />
      // case TwoFaScreens.PasswordHint:
      //   return <SettingsTwoWaPasswordHint />
      // case TwoFaScreens.PasswordSet:
      //   return <SettingsTwoFasPasswordSet />
    }
  }

  const prevScreen = usePrevious(activeScreen)

  /* IF HAS PASSWORD */
  const testDir =
    MOCK_TWO_FA.value &&
    activeScreen === SettingsScreens.TwoFaMain &&
    prevScreen === SettingsScreens.TwoFaEnterPassword
      ? 1
      : 'auto'

  return (
    <Transition
      containerClassname="two-fa"
      // name={APP_TRANSITION_NAME} // is mobile? slideDark : zoomSlide
      innerClassnames={{
        [SettingsScreens.TwoFaEnterPassword]: 'two-fa-enter-password',
        [SettingsScreens.TwoFaReEnterPassword]: 'two-fa-enter-password',
        [SettingsScreens.TwoFaPasswordHint]: 'two-fa-hint',
        [SettingsScreens.TwoFaEmail]: 'two-fa-email',
      }}
      name={getPreferredAnimations().page}
      activeKey={activeScreen}
      shouldCleanup
      shouldLockUI
      direction={testDir}
    >
      {renderScreen()}
    </Transition>
  )
}

export default memo(SettingsTwoFa)
