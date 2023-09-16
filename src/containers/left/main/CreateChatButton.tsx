import {type FC, useCallback, useMemo} from 'preact/compat'

import clsx from 'clsx'

import {getGlobalState} from 'state/signal'

import {useBoolean} from 'hooks/useFlag'

import {t} from 'lib/i18n'

import {LeftColumnScreen} from 'types/ui'

import {Menu, MenuItem} from 'components/popups/menu'
import {FloatButton, Icon} from 'components/ui'

import {useLeftColumn} from '../context'

import './CreateChatButton.scss'

export const CreateChatButton: FC = () => {
  const {value, setFalse, setTrue} = useBoolean(false)
  const {setScreen} = useLeftColumn()

  const lang = getGlobalState((state) => state.settings.i18n.lang_code)

  const handleNewPrivateChat = useCallback(() => {
    setScreen(LeftColumnScreen.Contacts)
  }, [setScreen])
  const handleNewChannel = useCallback(() => {
    setScreen(LeftColumnScreen.NewChannelStep1)
  }, [setScreen])
  const handleNewGroup = useCallback(() => {
    setScreen(LeftColumnScreen.NewGroupStep1)
  }, [setScreen])
  const renderItems = useMemo(
    () => (
      <>
        <MenuItem onClick={handleNewChannel}>
          <Icon name="channel" />
          {t('NewChannel')}
        </MenuItem>
        <MenuItem onClick={handleNewGroup}>
          <Icon name="users" />
          {t('NewGroup')}
        </MenuItem>
        <MenuItem onClick={handleNewPrivateChat}>
          <Icon name="user" />
          {t('NewPrivateChat')}
        </MenuItem>
      </>
    ),
    [lang]
  )
  const renderIcon = useMemo(() => {
    return (
      <>
        <Icon name="close" />
        <Icon name="editFilled" />
      </>
    )
  }, [])

  const buildedClass = clsx('CreateChat-Button', {
    open: value,
  })
  return (
    <div class={buildedClass}>
      <FloatButton shown aria-label={t('CreateChat')} icon={renderIcon} onClick={setTrue} />
      <Menu
        transform="bottom right"
        placement={{
          bottom: true,
          right: true,
        }}
        className="CreateChat-Menu"
        isOpen={value}
        onClose={setFalse}
        withBackdrop
      >
        {renderItems}
      </Menu>
    </div>
  )
}
