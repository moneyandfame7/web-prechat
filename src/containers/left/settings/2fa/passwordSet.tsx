import {type FC, useEffect} from 'preact/compat'

import {SettingsContext} from 'context/settings'

import {TEST_translate} from 'lib/i18n'
import {LottiePlayer} from 'lib/lottie'

import {addKeyboardListeners} from 'utilities/keyboardListener'

import {ColumnSection} from 'containers/left/ColumnSection'

import {ColumnWrapper} from 'components/ColumnWrapper'
import {Button} from 'components/ui'

const SettingsTwoFaPasswordSet: FC = () => {
  const {resetScreen} = SettingsContext.useScreenContext()

  useEffect(() => addKeyboardListeners({onEnter: () => resetScreen()}))
  return (
    <ColumnWrapper onGoBack={resetScreen} title={TEST_translate('TwoFa.PasswordSet')}>
      <ColumnSection>
        <LottiePlayer name="party-man" autoplay />
        <p class="two-fa-info">{TEST_translate('TwoFa.SetPasswordInfo')}</p>
        <Button onClick={() => resetScreen()}>{TEST_translate('ReturnToSettings')}</Button>
      </ColumnSection>
    </ColumnWrapper>
  )
}

export {SettingsTwoFaPasswordSet}
