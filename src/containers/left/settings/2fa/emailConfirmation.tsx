import {useSignal} from '@preact/signals'
import {type FC, memo} from 'preact/compat'

import {SettingsContext} from 'context/settings'

import {connect} from 'state/connect'

import {TEST_translate} from 'lib/i18n'
import {LottiePlayer} from 'lib/lottie'

import type {TwoFaState} from 'types/state'

import {ColumnSection} from 'containers/left/ColumnSection'

import {ColumnWrapper} from 'components/ColumnWrapper'
import {Button, CodeInput} from 'components/ui'

interface StateProps {
  twoFaState: TwoFaState
}
const SettingsTwoFaEmailConfirmationImpl: FC<StateProps> = ({twoFaState}) => {
  const {resetScreen} = SettingsContext.useScreenContext()
  const code = useSignal('')

  const changeCode = (v: string) => {
    code.value = v
  }

  return (
    <ColumnWrapper onGoBack={resetScreen} title={TEST_translate('TwoFa.RecoveryCode')}>
      <ColumnSection>
        <LottiePlayer name="email-recovery" />
        {/* <InputText placeholder={}/> */}
        <CodeInput
          value={code}
          onInput={changeCode}
          cb={() => {
            console.log('VERIFY CODE')
          }}
        />
        {twoFaState.newEmail && (
          <p class="two-fa-info">
            {TEST_translate('TwoFa.RecoveryInfo', {email: twoFaState.newEmail})}
          </p>
        )}

        {/* On change email need to call api? */}
        <Button variant="transparent">Change email</Button>
        <Button variant="transparent">Resend code</Button>
      </ColumnSection>
    </ColumnWrapper>
  )
}

export const SettingsTwoFaEmailConfirmation = memo(
  connect(
    (state): StateProps => ({
      twoFaState: state.twoFa,
    })
  )(SettingsTwoFaEmailConfirmationImpl)
)
