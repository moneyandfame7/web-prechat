import {type FC, memo, useCallback} from 'preact/compat'

import {SettingsContext} from 'context/settings'
import type {DeepSignal} from 'deepsignal'

import {getActions} from 'state/action'
import {connect} from 'state/connect'
import {getGlobalState} from 'state/signal'
import {updateGeneralSettings} from 'state/updates'

import {formatMessageTime} from 'utilities/date/convert'

import type {SettingsState} from 'types/state'

import {ColumnSection} from 'containers/left/ColumnSection'

import {ColumnWrapper} from 'components/ColumnWrapper'
import {ListItem} from 'components/ui/ListItem'
import {RadioGroup} from 'components/ui/RadioGroup'
import {Slider} from 'components/ui/Slider'

import './SettingsGeneral.scss'

interface StateProps {
  generalSettings: DeepSignal<SettingsState['general']>
}
const SettingsGeneralImpl: FC<StateProps> = ({generalSettings}) => {
  const global = getGlobalState()
  const {changeTheme} = getActions()
  const {resetScreen} = SettingsContext.useScreenContext()

  const handleChangeMessageSize = useCallback((messageTextSize: number) => {
    updateGeneralSettings(global, {messageTextSize})
    // document.body.style.
    document.documentElement.attributeStyleMap.set(
      '--message-text-size',
      `${messageTextSize}px`
    )
  }, [])

  const handleChangeSendKey = useCallback((messageSendByKey: 'enter' | 'ctrl-enter') => {
    updateGeneralSettings(global, {messageSendByKey})
  }, [])
  return (
    <ColumnWrapper title="General" onGoBack={resetScreen}>
      <ColumnSection title="Settings">
        <div class="settings-message-size">
          <div class="message-size-details">
            <p class="message-size__title">Message Text Size</p>
            <p class="message-size__value">{generalSettings.$messageTextSize}</p>
          </div>
          <Slider
            value={generalSettings.$messageTextSize!}
            min={12}
            max={20}
            onChange={handleChangeMessageSize}
          />
        </div>

        <ListItem icon="image" title="Chat Wallpaper" />
        <ListItem withCheckbox title="Enable Animations" />
      </ColumnSection>
      <ColumnSection title="Color Theme">
        <RadioGroup
          value={generalSettings.theme}
          onChange={changeTheme as (payload: string) => void}
          values={[
            {value: 'light', label: 'Day'},
            {value: 'dark', label: 'Night'},
            {value: 'loh', label: 'System Default'},
          ]}
        />
      </ColumnSection>

      <ColumnSection title="Keyboard">
        <RadioGroup
          value="light"
          onChange={(v) => {
            console.log({v})
          }}
          values={[
            {value: 'enter', label: 'Send By Enter', subtitle: 'New line by Shift + Enter'},
            {value: 'ctrl-enter', label: 'Send by cmd + Enter', subtitle: 'New line by Enter'},
          ]}
        />
      </ColumnSection>
      <ColumnSection title="Time Format">
        <RadioGroup
          value="light"
          onChange={(v) => {
            console.log({v})
          }}
          values={[
            {value: '12h', label: '12-hour', subtitle: formatMessageTime(new Date(), true)},
            {value: '24h', label: '24-hour', subtitle: formatMessageTime(new Date(), false)},
          ]}
        />
      </ColumnSection>
    </ColumnWrapper>
  )
}

export default memo(
  // eslint-disable-next-line @typescript-eslint/ban-types
  connect<{}, StateProps>((state) => {
    return {
      generalSettings: state.settings.general,
    }
  })(SettingsGeneralImpl)
)
