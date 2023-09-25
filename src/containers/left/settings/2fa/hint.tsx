import {type FC, memo, useEffect} from 'preact/compat'

import {SettingsContext} from 'context/settings'

import {getActions} from 'state/action'
import {connect} from 'state/connect'

import {useSignalForm} from 'hooks/useSignalForm'

import {TEST_translate} from 'lib/i18n'
import {LottiePlayer} from 'lib/lottie'

import {addKeyboardListeners} from 'utilities/keyboardListener'

import {SettingsScreens} from 'types/screens'
import type {TwoFaState} from 'types/state'

import {ColumnSection} from 'containers/left/ColumnSection'

import {ColumnWrapper} from 'components/ColumnWrapper'
import {Button, InputText} from 'components/ui'

interface StateProps {
  twoFaState: TwoFaState
}
const SettingsTwoFaHintImpl: FC<StateProps> = ({twoFaState}) => {
  // const {setScreen, resetScreen} = useTwoFaStore()
  const {setScreen, resetScreen} = SettingsContext.useScreenContext()
  const {showNotification} = getActions()
  // const hint = useSignal('')
  // const changeHint = (e: TargetedEvent<HTMLInputElement>) => {
  //   hint.value = e.currentTarget.value
  // }
  // const isContinueDisabled = useComputed(() => hint.value.length === 0)

  const [hint, changeHint, , isContinueDisabled] = useSignalForm()
  const handleNext = (withHint: boolean) => {
    const savedHint = withHint ? hint.value : undefined
    if (savedHint && savedHint === twoFaState.newPassword) {
      showNotification({title: TEST_translate('TwoFa.HintAsPasswordError')})

      return
    }
    twoFaState.newHint = hint.value
    setScreen(SettingsScreens.TwoFaEmail)
  }
  useEffect(() => addKeyboardListeners({onEnter: () => handleNext(true)}), [])
  return (
    <ColumnWrapper onGoBack={resetScreen} title={TEST_translate('TwoFa.HintTitle')}>
      <ColumnSection>
        <LottiePlayer name="two-fa-hint" autoplay />
        <InputText
          maxLength={10}
          value={hint}
          onInput={(e) => changeHint(e.currentTarget.value)}
          autoFocus
          label={TEST_translate('TwoFa.HintPlaceholder')}
        />
        <Button onClick={() => handleNext(true)} isDisabled={isContinueDisabled}>
          {TEST_translate('Continue')}
        </Button>
        <Button onClick={() => handleNext(false)} variant="transparent">
          {TEST_translate('Skip')}
        </Button>
      </ColumnSection>
    </ColumnWrapper>
  )
}

export const SettingsTwoFaHint = memo(
  connect(
    (state): StateProps => ({
      twoFaState: state.twoFa,
    })
  )(SettingsTwoFaHintImpl)
)
