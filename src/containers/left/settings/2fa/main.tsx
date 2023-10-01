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

interface StateProps {
  twoFaState: TwoFaState
}

const SettingsTwoFaMainImpl: FC<StateProps> = ({twoFaState}) => {
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

export const SettingsTwoFaMain = memo(
  connect(
    (state): StateProps => ({
      twoFaState: state.twoFa,
    })
  )(SettingsTwoFaMainImpl)
)

// hint

/* <svg class="rlottie-vector media-sticker thumbnail" viewBox="0 0 512 512"><path d="M257,471c-30,7-25-14-42-25-5-3-11-2-13-9-2-9,0-18-1-27-4-19-12-40-15-60-9-63-68-97-75-160-15-132,157-198,238-98,31,39,38,96,16,141-10,21-27,39-38,61-7,16-15,49-18,67-1,8,3,18,2,28-2,10-7,23-8,34,0,4,3,8,1,13-2,5-7,4-11,7-18,15-2,26-36,28z"></path></svg> */

// love-letter
/* <svg class="rlottie-vector media-sticker thumbnail" viewBox="0 0 512 512"><path d="M258,421h-196l-4,1-3,1-3-2-2-2-2-3-2-3,0-130,0-130,3-2,2-3,3-2,3-2h198,198l4,2,3,2,2,3,2,3v130,130l-2,3-2,3-3,2-4,2h-196z"></path></svg>
 */

// email-confirmation
/* <svg class="rlottie-vector media-sticker thumbnail" viewBox="0 0 512 512"><path d="M265,475c-11-2-46-2-53-14-6-10,6-81,0-86-9-8-132,9-144-3-8-8-4-83-4-99,0-49-12-116,22-156,38-45,104-31,155-30,74,3,176-14,205,74,12,37,15,158,9,195-1,9-17,13-22,13-9,1-112,1-112,3-2,61,25,104-56,103z"></path></svg>

*/
