import {type FC, memo, useCallback, useMemo} from 'preact/compat'

import {SettingsContext} from 'context/settings'
import type {DeepSignal} from 'deepsignal'

import {getActions} from 'state/action'
import {connect} from 'state/connect'
import {getGlobalState} from 'state/signal'
import {updateGeneralSettings} from 'state/updates'

import {formatMessageTime} from 'utilities/date/convert'

import type {SendShortcut, SettingsState, TimeFormat} from 'types/state'

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
  const {changeTheme, changeGeneralSettings} = getActions()
  const {resetScreen} = SettingsContext.useScreenContext()

  const handleChangeSettings = <T extends keyof SettingsState['general']>(
    key: T,
    value: SettingsState['general'][T]
  ) => {
    return () => {
      changeGeneralSettings({
        [key]: value,
      })
    }
  }

  const SETTINGS_SECTIONS = useMemo(
    () => ({
      theme: [
        {value: 'light', label: 'Day'},
        {value: 'dark', label: 'Night'},
        {value: 'system', label: 'System Default'},
      ],
      sendByKey: [
        {value: 'enter', label: 'Send By Enter', subtitle: 'New line by Shift + Enter'},
        {value: 'ctrl-enter', label: 'Send by ⌘ + Enter', subtitle: 'New line by Enter'},
      ],
      timeFormat: [
        {value: '12h', label: '12-hour', subtitle: formatMessageTime(new Date(), true)},
        {value: '24h', label: '24-hour', subtitle: formatMessageTime(new Date(), false)},
      ],
    }),
    []
  )
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
            onChange={(range) => handleChangeSettings('messageTextSize', range)()}
          />
        </div>

        <ListItem icon="image" title="Chat Wallpaper" />
        <ListItem
          onClick={handleChangeSettings('animations', !generalSettings.animations)}
          withCheckbox
          title="Enable Animations"
          isChecked={generalSettings.animations}
        />
      </ColumnSection>
      <ColumnSection title="Color Theme">
        <RadioGroup
          value={generalSettings.theme}
          onChange={changeTheme as (payload: string) => void}
          values={SETTINGS_SECTIONS.theme}
        />
      </ColumnSection>
      <ColumnSection title="Keyboard">
        <RadioGroup
          value={generalSettings.messageSendByKey}
          onChange={(v) => handleChangeSettings('messageSendByKey', v as SendShortcut)()}
          values={SETTINGS_SECTIONS.sendByKey}
        />
      </ColumnSection>
      <ColumnSection title="Time Format">
        <RadioGroup
          value={generalSettings.timeFormat}
          onChange={(v) => handleChangeSettings('timeFormat', v as TimeFormat)()}
          values={SETTINGS_SECTIONS.timeFormat}
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
