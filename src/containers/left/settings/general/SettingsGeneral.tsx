import {type FC, memo, useCallback, useMemo} from 'preact/compat'

import {SettingsContext} from 'context/settings'
import type {DeepSignal} from 'deepsignal'

import {getActions} from 'state/action'
import {connect} from 'state/connect'
import {INITIAL_STATE} from 'state/initState'

import {useBoolean} from 'hooks/useFlag'

import {formatMessageTime} from 'utilities/date/convert'

import type {
  ChatFoldersAnimations,
  PageAnimations,
  SendShortcut,
  SettingsState,
  TimeFormat,
} from 'types/state'

import {ColumnSection} from 'containers/left/ColumnSection'

import {ColumnSubtitle} from 'components/ColumnSubtitle'
import {ColumnWrapper} from 'components/ColumnWrapper'
import ConfirmModal from 'components/popups/ConfirmModal.async'
import {Divider, Icon} from 'components/ui'
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

  const handleChangeMessageSize = useCallback((size: number) => {
    changeGeneralSettings({
      messageTextSize: size,
    })
  }, [])

  const handleChangePageAnimations = useCallback((name: string) => {
    changeGeneralSettings({
      animations: {
        chatFolders: generalSettings.animations.chatFolders,
        page: name as PageAnimations,
      },
    })
  }, [])
  const handleChangeChatFoldersAnimations = useCallback((name: string) => {
    changeGeneralSettings({
      animations: {
        chatFolders: name as ChatFoldersAnimations,
        page: generalSettings.animations.page,
      },
    })
  }, [])
  const handleToggleAnimations = useCallback(() => {
    changeGeneralSettings({
      animationsEnabled: !generalSettings.animationsEnabled,
    })
  }, [])
  const handleChangeFormat = useCallback((format: string) => {
    changeGeneralSettings({
      timeFormat: format as TimeFormat,
    })
  }, [])
  const handleChangeSendKey = useCallback((shortcut: string) => {
    changeGeneralSettings({
      messageSendByKey: shortcut as SendShortcut,
    })
  }, [])

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
      pageAnimations: [
        {value: 'zoomSlide', label: 'Zoom Slide'},
        {value: 'slideDark', label: 'Slide Dark'},
      ],
      chatFoldersAnimations: [
        {value: 'fade', label: 'Fade'},
        {value: 'slide', label: 'Slide'},
      ],
    }),
    []
  )

  const {
    value: isConfirmModalOpen,
    setTrue: openConfirmModal,
    setFalse: closeConfirmModal,
  } = useBoolean()

  const handleResetGeneralSettings = useCallback(() => {
    changeGeneralSettings(INITIAL_STATE.settings.general)
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
        <ListItem
          onClick={handleToggleAnimations}
          withCheckbox
          title="Enable Animations"
          isChecked={generalSettings.animationsEnabled}
        />
        <ListItem
          onClick={openConfirmModal}
          className="reset-to-default"
          icon="tools"
          title="Reset to Default"
          danger
        />
        <ConfirmModal
          isOpen={isConfirmModalOpen}
          onClose={closeConfirmModal}
          title="Are you sure you want to reset settings?"
          action="Reset"
          callback={handleResetGeneralSettings}
        />
      </ColumnSection>
      <ColumnSection className="settings-general__animations">
        <Divider bold primary>
          Animations
        </Divider>

        <ColumnSubtitle>
          <Icon name="stickers" />
          Page
        </ColumnSubtitle>
        <RadioGroup
          disabled={!generalSettings.animationsEnabled}
          value={generalSettings.animations.page}
          onChange={handleChangePageAnimations}
          values={SETTINGS_SECTIONS.pageAnimations}
        />

        <ColumnSubtitle>
          <Icon name="folder" /> Chat Folders
        </ColumnSubtitle>

        <RadioGroup
          disabled={!generalSettings.animationsEnabled}
          value={generalSettings.animations.chatFolders}
          onChange={handleChangeChatFoldersAnimations}
          values={SETTINGS_SECTIONS.chatFoldersAnimations}
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
          onChange={handleChangeSendKey}
          values={SETTINGS_SECTIONS.sendByKey}
        />
      </ColumnSection>
      <ColumnSection title="Time Format">
        <RadioGroup
          value={generalSettings.timeFormat}
          onChange={handleChangeFormat}
          values={SETTINGS_SECTIONS.timeFormat}
        />
      </ColumnSection>
    </ColumnWrapper>
  )
}

export default memo(
  // eslint-disable-next-line @typescript-eslint/ban-types
  connect<{}, StateProps>((state) => ({
    generalSettings: state.settings.general,
  }))(SettingsGeneralImpl)
)
