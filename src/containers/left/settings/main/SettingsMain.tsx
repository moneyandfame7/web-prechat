import {type FC, memo, useCallback, useEffect, useMemo} from 'preact/compat'

import {SettingsContext} from 'context/settings'

import {getActions} from 'state/action'
import {selectSelf} from 'state/selectors/users'
import {getGlobalState} from 'state/signal'

import {useBoolean} from 'hooks/useFlag'

import {TEST_translate} from 'lib/i18n/types'

import {getInitials} from 'utilities/string/getInitials'

import {SettingsScreens} from 'types/screens'

import {useLeftColumn} from 'containers/left/context'

import {ColumnWrapper} from 'components/ColumnWrapper'
import {ConfirmButton} from 'components/ConfirmButton'
import {ProfileAvatar} from 'components/ProfileAvatar'
import ConfirmModal from 'components/popups/ConfirmModal.async'
import {MenuItem} from 'components/popups/menu'
import {Icon, IconButton, type IconName} from 'components/ui'
import {DropdownMenu} from 'components/ui/DropdownMenu'
import {ListItem} from 'components/ui/ListItem'

import './SettingsMain.scss'

interface SettingsItem {
  icon: IconName
  /* name - keyof i18n pack???? */
  name: string
  screen: SettingsScreens
  withRight?: true
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
    withRight: true,
  },
  {
    icon: 'language',
    name: 'Language',
    screen: SettingsScreens.Language,
    withRight: true,
  },
]

const SettingsMain: FC = () => {
  const {resetScreen} = useLeftColumn()
  const {copyToClipboard, getAuthorizations, signOut} = getActions()
  const global = getGlobalState()
  const currentUser = selectSelf(global)

  const {setScreen} = SettingsContext.useScreenContext()
  const handleEditProfile = useCallback(() => {
    setScreen(SettingsScreens.EditProfile)
  }, [])

  const handleClickPhone = useCallback(() => {
    copyToClipboard({
      toCopy: global.auth.phoneNumber!,
      title: 'Phone copied to clipboard.',
    })
  }, [])

  const activeSessionsCount = global.activeSessions.ids.length.toString()

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

  useEffect(() => {
    getAuthorizations()
  }, [])

  const renderSettingsItems = useCallback(() => {
    return SETTINGS_ITEMS.map((item) => (
      <ListItem
        key={item.name}
        withRipple
        onClick={() => {
          setScreen(item.screen)
        }}
        icon={item.icon}
        title={item.name}
        right={
          item.screen === SettingsScreens.Devices
            ? activeSessionsCount
            : item.screen === SettingsScreens.Language
            ? TEST_translate('LANG_NATIVE_NAME')
            : undefined
        }
      >
        {/* <div class="settings-item"> */}
        {/* <Icon name={item.icon} /> */}
        {/* <p>{item.name}</p> */}
        {/* </div> */}
      </ListItem>
    ))
  }, [global.activeSessions.ids])
  const {
    value: isLogoutOpen,
    setFalse: onCloseLogout,
    setTrue: openLogoutConfirm,
  } = useBoolean()
  return (
    <ColumnWrapper
      title="Settings"
      onGoBack={resetScreen}
      headerContent={
        <>
          <IconButton icon="edit" onClick={handleEditProfile} />
          <DropdownMenu
            placement={{
              right: true,
              top: true,
            }}
            transform="top right"
            button={<IconButton icon="more" />}
            mount={false}
          >
            <MenuItem onClick={openLogoutConfirm}>
              <Icon name="logout" />
              Log out
            </MenuItem>
          </DropdownMenu>
          <ConfirmModal
            isOpen={isLogoutOpen}
            onClose={onCloseLogout}
            title="Are you sure you want to log out?"
            action="Log Out"
            callback={signOut}
          />
        </>
      }
    >
      <div class="settings-image">
        {/*  */}
        <ProfileAvatar peer={currentUser!} />
      </div>
      <div class="settings-section">
        <ListItem withRipple onClick={handleClickPhone}>
          <div class="settings-item">
            <Icon name="phone" />
            <div class="info">
              <p>{global.auth.phoneNumber}</p>
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

      <div class="settings-section">{renderSettingsItems()}</div>
    </ColumnWrapper>
  )
}

export default memo(SettingsMain)
