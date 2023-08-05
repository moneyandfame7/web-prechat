import {type FC, memo, useCallback, useState, useEffect, useRef} from 'preact/compat'

import {Icon, IconButton, type IconName} from 'components/ui'
import {useLeftColumn} from 'containers/left/context'

import {SettingsContext} from 'context/settings'
import {SettingsScreens} from 'types/screens'

import {ListItem} from 'components/ui/ListItem'

import {getGlobalState} from 'state/signal'

import './SettingsMain.scss'
import clsx from 'clsx'
import {getActions} from 'state/action'

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
    screen: SettingsScreens.General
  },
  {
    icon: 'unmute',
    name: 'Notifications and sound',
    screen: SettingsScreens.Notifications
  },
  {
    icon: 'data',
    name: 'Data and storage',
    screen: SettingsScreens.DataAndStorage
  },
  {
    icon: 'lock',
    name: 'Privacy and security',
    screen: SettingsScreens.Privacy
  },
  {
    icon: 'favourites',
    name: 'Appearance',
    screen: SettingsScreens.Appearance
  },
  {
    icon: 'folder',
    name: 'Chat folders',
    screen: SettingsScreens.ChatFolders
  },
  {
    icon: 'devices',
    name: 'Devices',
    screen: SettingsScreens.Devices
  },
  {
    icon: 'language',
    name: 'Language',
    screen: SettingsScreens.Language
  }
]
const SettingsMain: FC = () => {
  const {resetScreen} = useLeftColumn()
  const {copyToClipboard} = getActions()
  const {setScreen} = SettingsContext.useScreenContext()
  const {auth} = getGlobalState()
  const handleEditProfile = useCallback(() => {
    setScreen(SettingsScreens.EditProfile)
  }, [])

  const handleShowMenu = useCallback(() => {
    /* Not implemented */
  }, [])

  const ref = useRef<HTMLDivElement>(null)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      if (!ref.current) {
        return
      }
      const isScrolled = ref.current.scrollTop > 0

      setIsScrolled(isScrolled)
    }

    ref.current?.addEventListener('scroll', handleScroll)

    return () => ref.current?.removeEventListener('scroll', handleScroll)
  }, [])

  const headerClass = clsx('LeftColumn-Header', {
    'scrolled': isScrolled
  })

  const handleClickPhone = useCallback(() => {
    copyToClipboard({
      toCopy: auth.phoneNumber!,
      title: 'Phone copied to clipboard.'
    })
  }, [])

  const handleClickBio = useCallback(() => {
    copyToClipboard({
      toCopy: 'current user bio',
      title: 'Bio copied to clipboard.'
    })
  }, [])

  const handleClickUsername = useCallback(() => {
    copyToClipboard({
      toCopy: 'username to copy',
      title: 'Username copied to clipboard.'
    })
  }, [])

  return (
    <>
      <div class={headerClass}>
        <IconButton icon="arrowLeft" onClick={resetScreen} />
        <p class="LeftColumn-Header_title">Settings</p>
        <div class="btn-actions">
          <IconButton icon="edit" onClick={handleEditProfile} />
          <IconButton icon="more" onClick={handleShowMenu} />
        </div>
      </div>
      <div class="LeftColumn-Inner" id="smth" ref={ref}>
        <div class="settings-image"></div>

        <div class="settings-container">
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

        <div class="settings-container">
          {SETTINGS_ITEMS.map((item) => (
            <ListItem
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
      </div>
    </>
  )
}

export default memo(SettingsMain)
