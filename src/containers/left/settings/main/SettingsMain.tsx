import {type FC, memo, useCallback} from 'preact/compat'

import {SettingsContext} from 'context/settings'

import {getActions} from 'state/action'
import {getGlobalState} from 'state/signal'

import {SettingsScreens} from 'types/screens'

import {useLeftColumn} from 'containers/left/context'

import {ColumnWrapper} from 'components/ColumnWrapper'
import {Icon, IconButton, type IconName} from 'components/ui'
import {ListItem} from 'components/ui/ListItem'

import './SettingsMain.scss'

interface SettingsItem {
  icon: IconName
  /* name - keyof i18n pack???? */
  name: string
  screen: SettingsScreens
}

const SETTINGS_ITEMS: SettingsItem[] = [
  {
    icon: 'settings',
    name: 'General settings',
    screen: SettingsScreens.General,
  },
  {
    icon: 'unmute',
    name: 'Notifications and sound',
    screen: SettingsScreens.Notifications,
  },
  {
    icon: 'data',
    name: 'Data and storage',
    screen: SettingsScreens.DataAndStorage,
  },
  {
    icon: 'lock',
    name: 'Privacy and security',
    screen: SettingsScreens.Privacy,
  },
  {
    icon: 'favourites',
    name: 'Appearance',
    screen: SettingsScreens.Appearance,
  },
  {
    icon: 'folder',
    name: 'Chat folders',
    screen: SettingsScreens.ChatFolders,
  },
  {
    icon: 'devices',
    name: 'Devices',
    screen: SettingsScreens.Devices,
  },
  {
    icon: 'language',
    name: 'Language',
    screen: SettingsScreens.Language,
  },
]
const SettingsMain: FC = () => {
  const {resetScreen} = useLeftColumn()
  const {copyToClipboard} = getActions()
  const auth = getGlobalState((state) => state.auth)

  const {setScreen} = SettingsContext.useScreenContext()
  const handleEditProfile = useCallback(() => {
    setScreen(SettingsScreens.EditProfile)
  }, [])

  const handleShowMenu = useCallback(() => {
    /* Not implemented */
  }, [])

  const handleClickPhone = useCallback(() => {
    copyToClipboard({
      toCopy: auth.phoneNumber!,
      title: 'Phone copied to clipboard.',
    })
  }, [])

  const handleClickBio = useCallback(() => {
    copyToClipboard({
      toCopy: 'current user bio',
      title: 'Bio copied to clipboard.',
    })
  }, [])

  const handleClickUsername = useCallback(() => {
    copyToClipboard({
      toCopy: 'username to copy',
      title: 'Username copied to clipboard.',
    })
  }, [])

  return (
    <ColumnWrapper
      title="Settings"
      onGoBack={resetScreen}
      headerContent={
        <>
          <IconButton icon="edit" onClick={handleEditProfile} />
          <IconButton icon="more" onClick={handleShowMenu} />
        </>
      }
    >
      <div class="settings-image">{/*  */}</div>
      <div class="settings-section">
        <ListItem withRipple onClick={handleClickPhone}>
          <div class="settings-item">
            <Icon name="phone" />
            <div class="info">
              <p>{auth.phoneNumber}</p>
              <p class="subtitle">Phone Number</p>
            </div>
          </div>
        </ListItem>
        <ListItem withRipple onClick={handleClickUsername}>
          <div class="settings-item">
            <Icon name="username" />
            <div class="info">
              <p>moneyandfame</p>
              <p class="subtitle">Username</p>
            </div>
          </div>
        </ListItem>
        <ListItem withRipple onClick={handleClickBio}>
          <div class="settings-item">
            <Icon name="info2" />
            <div class="info">
              <p>Lorem ipsum dorem 💅</p>
              <p class="subtitle">Bio</p>
            </div>
          </div>
        </ListItem>
      </div>

      <div class="settings-section">
        {SETTINGS_ITEMS.map((item) => (
          <ListItem
            key={item.name}
            withRipple
            onClick={() => {
              setScreen(item.screen)
            }}
          >
            <div class="settings-item">
              <Icon name={item.icon} />
              <p>{item.name}</p>
            </div>
          </ListItem>
        ))}
      </div>
    </ColumnWrapper>
  )
}

export default memo(SettingsMain)
