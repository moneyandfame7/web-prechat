import {useSignal} from '@preact/signals'
import {type FC, memo, useEffect, useRef} from 'preact/compat'

import {SettingsContext} from 'context/settings'

import {connect} from 'state/connect'

import {useSignalForm} from 'hooks/useSignalForm'

import {TEST_translate} from 'lib/i18n'

import {addKeyboardListeners} from 'utilities/keyboardListener'
import {stopEvent} from 'utilities/stopEvent'

import {SettingsScreens} from 'types/screens'
import type {TwoFaState} from 'types/state'

import {ColumnSection} from 'containers/left/ColumnSection'

import {ColumnWrapper} from 'components/ColumnWrapper'
import {MonkeyTrack} from 'components/monkeys'
import {Button, PasswordInput} from 'components/ui'

interface StateProps {
  twoFaState: TwoFaState
}
const SettingsTwoFaReEnterPasswordImpl: FC<StateProps> = ({twoFaState}) => {
  const {resetScreen, setScreen} = SettingsContext.useScreenContext()
  const showPassword = useSignal(false)

  const [inputValue, handleChangePassword, inputError] = useSignalForm()
  const verifyInput = () => {
    if (inputValue.value !== twoFaState.newPassword) {
      inputError.value = TEST_translate('IncorrectPassword')
      return false
    }

    return true
  }

  const handleContinue = (e?: Event) => {
    if (e) {
      stopEvent(e)
    }
    if (!verifyInput()) {
      return
    }

    setScreen(SettingsScreens.TwoFaPasswordHint)
  }

  useEffect(() => addKeyboardListeners({onEnter: handleContinue}), [])
  const inputRef = useRef<HTMLInputElement>(null)

  return (
    <ColumnWrapper onGoBack={resetScreen} title={TEST_translate('TwoFa.ReEnterPassword')}>
      <ColumnSection>
        {/* <MonkeyPassword see={showPassword} /> */}
        <MonkeyTrack
          inputRef={inputRef}
          currentLength={inputValue.value.length}
          maxLength={20}
        />
        <PasswordInput
          elRef={inputRef}
          autoFocus
          error={inputError}
          value={inputValue}
          onInput={handleChangePassword}
          label={TEST_translate('TwoFa.ReEnterPassword')}
          showPassword={showPassword}
        />
        <Button onClick={handleContinue}>{TEST_translate('Continue')}</Button>
      </ColumnSection>
    </ColumnWrapper>
  )
}

export const SettingsTwoFaReEnterPassword = memo(
  connect(
    (state): StateProps => ({
      twoFaState: state.twoFa,
    })
  )(SettingsTwoFaReEnterPasswordImpl)
)
// export {SettingsTwoFaReEnterPassword}
