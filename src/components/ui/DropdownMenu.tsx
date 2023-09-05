import {ComponentChildren, type VNode, cloneElement} from 'preact'
import type {FC} from 'preact/compat'

import {useBoolean} from 'hooks/useFlag'

import {ConfirmButton} from 'components/ConfirmButton'
import {Menu, MenuItem} from 'components/popups/menu'

import {Icon, type IconName} from '.'

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
  /* якщо в нас є компонент з модалкою - то потрібно не робити unmount  */
}
export const DropdownMenu: FC<DropdownMenuProps> = ({children, button}) => {
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
        // autoClose={false}
        placement="top right"
        withMount={false}
      >
        {children}
      </Menu>
    </div>
  )
}
