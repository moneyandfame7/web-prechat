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
import {Checkbox, Divider, Icon} from 'components/ui'
import {ListItem} from 'components/ui/ListItem'
import {RadioGroup, type RadioGroupItem} from 'components/ui/RadioGroup'
import {Slider} from 'components/ui/Slider'
import {SwitchInput} from 'components/ui/SwitchInput'

import './SettingsGeneral.scss'

interface StateProps {
  generalSettings: DeepSignal<SettingsState['general']>
}
const SettingsGeneralImpl: FC<StateProps> = ({generalSettings}) => {
  const {changeTheme, changeSettings} = getActions()
  const {resetScreen} = SettingsContext.useScreenContext()

  const handleChangeMessageSize = useCallback((size: number) => {
    changeSettings({
      general: {
        messageTextSize: size,
      },
    })
  }, [])

  const handleChangePageAnimations = useCallback((name: string) => {
    changeSettings({
      general: {
        animations: {
          page: name as PageAnimations,
        },
      },
    })
  }, [])
  const handleChangeChatFoldersAnimations = useCallback((name: string) => {
    changeSettings({
      general: {
        animations: {
          chatFolders: name as ChatFoldersAnimations,
        },
      },
    })
  }, [])
  const handleToggleAnimations = useCallback(() => {
    changeSettings({
      general: {
        animationsEnabled: !generalSettings.animationsEnabled,
      },
    })
  }, [])
  const handleChangeFormat = useCallback((format: string) => {
    changeSettings({
      general: {
        timeFormat: format as TimeFormat,
      },
    })
  }, [])
  const handleChangeSendKey = useCallback((shortcut: string) => {
    changeSettings({
      general: {
        messageSendByKey: shortcut as SendShortcut,
      },
    })
  }, [])

  const SETTINGS_SECTIONS = useMemo(
    () => ({
      theme: [
        {value: 'light', title: 'Day'},
        {value: 'dark', title: 'Night'},
        {value: 'system', title: 'System Default'},
      ],
      sendByKey: [
        {value: 'enter', title: 'Send By Enter', subtitle: 'New line by Shift + Enter'},
        {value: 'ctrl-enter', title: 'Send by ⌘ + Enter', subtitle: 'New line by Enter'},
      ],
      timeFormat: [
        {value: '12h', title: '12-hour', subtitle: formatMessageTime(new Date(), true)},
        {value: '24h', title: '24-hour', subtitle: formatMessageTime(new Date(), false)},
      ],
      pageAnimations: [
        {value: 'zoomSlide', title: 'Zoom Slide'},
        {value: 'slideDark', title: 'Slide Dark'},
      ],
      chatFoldersAnimations: [
        {value: 'fade', title: 'Fade'},
        {value: 'slide', title: 'Slide'},
      ],
    }),
    []
  ) satisfies Record<string, RadioGroupItem[]>

  const {
    value: isConfirmModalOpen,
    setTrue: openConfirmModal,
    setFalse: closeConfirmModal,
  } = useBoolean()

  const handleResetGeneralSettings = useCallback(() => {
    changeSettings({
      general: INITIAL_STATE.settings.general,
    })
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
        <Checkbox
          onToggle={handleToggleAnimations}
          label="Enable Animations"
          checked={generalSettings.animationsEnabled}
        />

        <Checkbox
          label="Menu blur"
          checked={generalSettings.blur}
          onToggle={(c) => {
            changeSettings({
              general: {
                blur: c,
              },
            })
          }}
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
          content="Are you sure you want to reset settings?"
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
