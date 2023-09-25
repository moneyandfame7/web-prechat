import {useSignalEffect} from '@preact/signals'
import {type FC, memo} from 'preact/compat'

import {SettingsContext} from 'context/settings'

import {connect} from 'state/connect'

import {useBoolean} from 'hooks/useFlag'
import {useSignalForm} from 'hooks/useSignalForm'

import {TEST_translate} from 'lib/i18n'
import {LottiePlayer} from 'lib/lottie'

import {addKeyboardListeners} from 'utilities/keyboardListener'
import {isValidEmail} from 'utilities/parse'
import {renderText} from 'utilities/parse/render'

import {SettingsScreens} from 'types/screens'
import type {TwoFaState} from 'types/state'

import {ColumnSection} from 'containers/left/ColumnSection'

import {ColumnWrapper} from 'components/ColumnWrapper'
import ConfirmModal from 'components/popups/ConfirmModal.async'
import {Button, InputText} from 'components/ui'

interface StateProps {
  twoFaState: TwoFaState
}
const SettingsTwoFaEmailImpl: FC<StateProps> = ({twoFaState}) => {
  // const {resetScreen, setScreen} = useTwoFaStore()
  const {setScreen, resetScreen} = SettingsContext.useScreenContext()

  const [inputValue, handleChange, inputError, isBtnDisabled] = useSignalForm()
  const handleContinue = () => {
    const email = inputValue.value

    const valid = isValidEmail(email)

    if (!valid) {
      inputError.value = 'Invalid email'

      return
    }

    twoFaState.newEmail = email
    setScreen(SettingsScreens.TwoFaEmailConfirmation)
    /* ... */
  }

  useSignalEffect(() =>
    addKeyboardListeners({onEnter: inputValue.value.length ? handleContinue : openConfirm})
  )

  const {value: isConfirmSkipOpen, setFalse: closeConfirm, setTrue: openConfirm} = useBoolean()
  return (
    <ColumnWrapper onGoBack={resetScreen} title={TEST_translate('TwoFa.EmailTitle')}>
      <ColumnSection>
        <LottiePlayer name="love-letter" autoplay />
        <InputText
          autoFocus
          label={TEST_translate('TwoFa.EmailTitle')}
          error={inputError}
          value={inputValue}
          onInput={(e) => handleChange(e.currentTarget.value)}
        />
        <Button isDisabled={isBtnDisabled} onClick={handleContinue}>
          {TEST_translate('Continue')}
        </Button>
        <Button onClick={openConfirm} variant="transparent">
          {TEST_translate('Skip')}
        </Button>
      </ColumnSection>
      <ConfirmModal
        isOpen={isConfirmSkipOpen}
        onClose={closeConfirm}
        title={TEST_translate('Warning')}
        action={TEST_translate('Skip')}
        content={renderText(TEST_translate('TwoFa.EmailSkip'), ['breakes'])}
        callback={() => {
          setScreen(SettingsScreens.TwoFaPasswordSet)
          // closeConfirm()
        }}
      />
    </ColumnWrapper>
  )
}

export const SettingsTwoFaEmail = memo(
  connect(
    (state): StateProps => ({
      twoFaState: state.twoFa,
    })
  )(SettingsTwoFaEmailImpl)
)
