import {useComputed, useSignal} from '@preact/signals'
import {type FC, memo, useEffect} from 'preact/compat'

import {SettingsContext} from 'context/settings'

import {connect} from 'state/connect'

import {useSignalForm} from 'hooks/useSignalForm'

import {TEST_translate} from 'lib/i18n'

import {MOCK_TWO_FA} from 'common/app'
import {addKeyboardListeners} from 'utilities/keyboardListener'
import {stopEvent} from 'utilities/stopEvent'

import {SettingsScreens} from 'types/screens'
import type {TwoFaState} from 'types/state'

import {ColumnSection} from 'containers/left/ColumnSection'

import {ColumnWrapper} from 'components/ColumnWrapper'
import {MonkeyPassword} from 'components/monkeys'
import {Button, PasswordInput} from 'components/ui'

interface StateProps {
  twoFaState: TwoFaState
}
const SettingsTwoFaEnterPasswordImpl: FC<StateProps> = ({twoFaState}) => {
  // const {resetScreen, setScreen} = useTwoFaStore()
  const {setScreen} = SettingsContext.useScreenContext()
  const isNew = !MOCK_TWO_FA.value ?? !twoFaState.hasPassword
  const showPassword = useSignal(false)
  const [inputValue, handleChange, inputError, isBtnDisabled] = useSignalForm()

  const handleContinue = (e?: Event) => {
    if (e) {
      stopEvent(e)
    }
    if (!isNew) {
      setScreen(SettingsScreens.TwoFaMain)

      return
    }
    if (!inputValue.value) {
      inputError.value = ''
      return
    }
    twoFaState.newPassword = inputValue.value
    setScreen(SettingsScreens.TwoFaReEnterPassword)
  }

  const handleBack = () => {
    if (isNew) {
      setScreen(SettingsScreens.TwoFaMain)
    } else {
      setScreen(SettingsScreens.Privacy)
      // resetScreen(true)
    }
  }

  useEffect(() => addKeyboardListeners({onEnter: handleContinue}), [])

  return (
    <ColumnWrapper
      onGoBack={handleBack}
      title={TEST_translate(isNew ? 'EnterFirstPassword' : 'EnterYourPassword')}
    >
      <ColumnSection>
        <MonkeyPassword see={showPassword} />
        <PasswordInput
          error={inputError}
          // disabled={auth.$isLoading}
          value={inputValue}
          onInput={handleChange}
          // label={'1234'}
          label={!isNew && twoFaState.hint ? twoFaState.hint : 'Password'}
          showPassword={showPassword}
        />
        <Button onClick={handleContinue} isDisabled={isBtnDisabled}>
          {TEST_translate('Continue')}
        </Button>
      </ColumnSection>
    </ColumnWrapper>
  )
}

export const SettingsTwoFaEnterPassword = memo(
  connect(
    (state): StateProps => ({
      twoFaState: state.twoFa,
    })
  )(SettingsTwoFaEnterPasswordImpl)
)
