import {useMemo, type FC, useCallback} from 'preact/compat'
import clsx from 'clsx'

import {t} from 'lib/i18n'
import {LeftColumnScreen} from 'types/ui'
import {getGlobalState} from 'state/signal'
import {useBoolean} from 'hooks/useFlag'

import {Menu, MenuItem} from 'components/popups/menu'
import {Icon, FloatButton} from 'components/ui'

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
    [handleNewPrivateChat, lang]
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
    open: value
  })
  return (
    <div class={buildedClass}>
      <FloatButton
        shown
        aria-label={t('CreateChat')}
        icon={renderIcon}
        onClick={setTrue}
      />
      <Menu
        placement="bottom right"
        className="CreateChat-Menu"
        isOpen={value}
        onClose={setFalse}
      >
        {renderItems}
      </Menu>
    </div>
  )
}
