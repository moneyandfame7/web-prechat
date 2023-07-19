import {useMemo, type FC, useCallback} from 'preact/compat'

import {t} from 'lib/i18n'

import {useBoolean} from 'hooks/useFlag'

import {Menu, MenuItem} from 'components/popups/menu'
import {Transition} from 'components/Transition'
import {Icon, FloatButton} from 'components/ui'

import {LeftColumnScreen} from 'types/ui'
import {getGlobalState} from 'state/signal'

import {useLeftColumn} from '../context'

import {signal} from '@preact/signals'

import './CreateChatButton.scss'
import clsx from 'clsx'

export const TEST_SIGNAL = signal(true)
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
        {/* <Transition
          className="FloatButton_icon"
          isVisible={value}
          withMount
          appear={false}
          duration={350}
          type="zoomFade"
        > */}
        <Icon name="close" />
        {/* </Transition> */}
        {/* <Transition
          className="FloatButton_icon"
          isVisible={!value}
          withMount
          appear={false}
          duration={500}
          type="zoomFade"
        > */}
        <Icon name="editFilled" />
        {/* </Transition> */}
      </>
    )
  }, [value])

  const buildedClass = clsx('CreateChat-Button', {
    open: value
  })
  return (
    <>
      <Transition
        full={false}
        isVisible={TEST_SIGNAL.value}
        type="zoomFade"
        appear={false}
        withMount={false}
      >
        <div style={{backgroundColor: 'pink'}}>Aboba</div>
      </Transition>
      <div class={buildedClass}>
        <FloatButton aria-label={t('CreateChat')} icon={renderIcon} onClick={setTrue} />
        <Menu
          placement="bottom-right"
          className="CreateChat-Menu"
          isOpen={value}
          onClose={setFalse}
          withMount={false}
        >
          {renderItems}
        </Menu>
      </div>
    </>
  )
}
