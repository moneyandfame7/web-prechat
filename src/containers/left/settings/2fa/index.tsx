import {type FC, memo, useEffect} from 'preact/compat'

import {SettingsContext} from 'context/settings'

import {connect} from 'state/connect'

import {useBoolean} from 'hooks/useFlag'

import {TEST_translate} from 'lib/i18n'
import {LottiePlayer} from 'lib/lottie'

import {MOCK_TWO_FA} from 'common/app'
import {addKeyboardListeners} from 'utilities/keyboardListener'
import {renderText} from 'utilities/parse/render'

import {SettingsScreens} from 'types/screens'
import type {TwoFaState} from 'types/state'

import {ColumnSection} from 'containers/left/ColumnSection'

import {ColumnWrapper} from 'components/ColumnWrapper'
import ConfirmModal from 'components/popups/ConfirmModal.async'
import {Button} from 'components/ui'
import {ListItem} from 'components/ui/ListItem'

import './styles.scss'

interface StateProps {
  twoFaState: TwoFaState
}

const SettingsTwoFaImpl: FC<StateProps> = ({twoFaState}) => {
  const {resetScreen, setScreen} = SettingsContext.useScreenContext()
  // const {setScreen, resetScreen: resetTwoFaScreen} = useTwoFaStore()

  const {
    value: isConfirmDisableOpen,
    setFalse: closeConfirm,
    setTrue: openConfirm,
  } = useBoolean()

  useEffect(() =>
    !MOCK_TWO_FA.value || !twoFaState.hasPassword
      ? addKeyboardListeners({onEnter: () => setScreen(SettingsScreens.TwoFaEnterPassword)})
      : undefined
  )

  function renderTitle() {
    return (
      <p class="two-fa-info">
        {renderText(
          TEST_translate(
            MOCK_TWO_FA.value || twoFaState.hasPassword
              ? 'TwoFa.EnabledPasswordText'
              : 'TwoFa.SetPasswordInfo'
          ),
          ['breakes', 'markdown']
        )}
      </p>
    )
  }

  function renderContent() {
    if (MOCK_TWO_FA.value || twoFaState.hasPassword) {
      return (
        <>
          <ListItem icon="edit">Change Password</ListItem>
          <ListItem icon="lockOff" onClick={openConfirm}>
            Disable Password
          </ListItem>
          {}
          <ListItem icon="email">
            {MOCK_TWO_FA.value ? 'Change Recovery Email' : 'Set Recovery Email'}
          </ListItem>
        </>
      )
    }

    return (
      <Button
        onClick={() => {
          setScreen(SettingsScreens.TwoFaEnterPassword)
        }}
      >
        {TEST_translate('TwoFa.SetPassword')}
      </Button>
    )
  }

  return (
    <ColumnWrapper onGoBack={resetScreen} title="Two-Step Verification">
      <ColumnSection withoutMargin>
        <LottiePlayer autoplay name="keychain" />
        {renderTitle()}
      </ColumnSection>
      <ColumnSection className="two-fa__actions">{renderContent()}</ColumnSection>
      <ConfirmModal
        callback={() => resetScreen()}
        content={TEST_translate('TwoFa.DisablePasswordAreYouSure')}
        action={TEST_translate('Disable')}
        isOpen={isConfirmDisableOpen}
        onClose={closeConfirm}
        title={TEST_translate('TwoFa.DisablePassword')}
      />
    </ColumnWrapper>
  )
}

export const SettingsTwoFa = memo(
  connect(
    (state): StateProps => ({
      twoFaState: state.twoFa,
    })
  )(SettingsTwoFaImpl)
)
