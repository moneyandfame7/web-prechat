import {type ComponentChildren, type VNode, cloneElement} from 'preact'
import type {FC} from 'preact/compat'

import {useBoolean} from 'hooks/useFlag'

import {Menu} from 'components/popups/menu'
import type {MenuPlacement, MenuTransform} from 'components/popups/menu/Menu'

import {type IconName} from '.'

import './DropdownMenu.scss'

interface MenuItems {
  icon?: IconName
  title: string
  handler?: VoidFunction
  withConfirm?: boolean
  action?: string
  // or just pass as children items
}
interface DropdownMenuProps {
  children: ComponentChildren
  button: VNode
  mount?: boolean
  transform?: MenuTransform
  placement?: MenuPlacement
  /* якщо в нас є компонент з модалкою - то потрібно не робити unmount  */
}
export const DropdownMenu: FC<DropdownMenuProps> = ({
  children,
  button,
  transform,
  placement,
  mount = false,
}) => {
  const {value: isMenuOpen, setTrue: openMenu, setFalse: closeMenu} = useBoolean(false)

  const cloned = cloneElement(button, {
    onClick: openMenu,
  })

  return (
    <div class="DropdownMenu">
      {cloned}
      <Menu
        isOpen={isMenuOpen}
        onClose={closeMenu}
        transform={transform}
        withMount={mount}
        placement={placement}
      >
        {children}
      </Menu>
    </div>
  )
}
