import {useMemo, type FC} from 'preact/compat'

import {t} from 'lib/i18n'

import {useBoolean} from 'hooks/useFlag'

// import { ReactComponent as ArrowRightIcon } from 'assets/icons/arrow-right.svg'
// import { ReactComponent as PlusIcon } from 'assets/icons/plus.svg'
// import { ReactComponent as CheckIcon } from 'assets/icons/check.svg'

import {Menu, MenuItem} from 'components/popups/menu'
import {Transition} from 'components/Transition'
import {Icon, FloatButton} from 'components/ui'

import './CreateChatButton.scss'

export const CreateChatButton: FC = () => {
  const {value, setFalse, setTrue} = useBoolean(false)

  const handleClickButton = () => {
    setTrue()
  }

  /* add usememo here and check on rerender when change language */
  const renderItems = (
    <>
      <MenuItem>
        <Icon name="channel" />
        {t('NewChannel')}
      </MenuItem>
      <MenuItem>
        <Icon name="users" />
        {t('NewGroup')}
      </MenuItem>
      <MenuItem>
        <Icon name="user" />
        {t('NewPrivateChat')}
      </MenuItem>
    </>
  )

  const renderIcon = useMemo(() => {
    return (
      <>
        <Transition
          className="Button-fab_icon"
          isVisible={value}
          withMount
          appear={false}
          duration={350}
          type="zoomFade"
        >
          <Icon name="close" />
        </Transition>
        <Transition
          className="Button-fab_icon"
          isVisible={!value}
          withMount
          appear={false}
          duration={500}
          type="zoomFade"
        >
          <Icon name="editFilled" />
        </Transition>
      </>
    )
  }, [value])
  return (
    <div class="CreateChat-Button">
      <FloatButton
        aria-label={t('CreateChat')}
        icon={renderIcon}
        onClick={handleClickButton}
      />
      <Menu
        placement="bottom-right"
        autoClose={false}
        className="CreateChat-Menu"
        isOpen={value}
        onClose={setFalse}
        withMount={false}
      >
        {renderItems}
      </Menu>
    </div>
  )
}
