import {type ComponentChildren, type VNode, cloneElement} from 'preact'
import type {FC} from 'preact/compat'

import {useBoolean} from 'hooks/useFlag'

import {Menu} from 'components/popups/menu'
import type {MenuPlacement, MenuTransform} from 'components/popups/menu/Menu'

// import {type IconName} from '.'
import './DropdownMenu.scss'

// interface MenuItems {
//   icon?: IconName
//   title: string
//   handler?: VoidFunction
//   withConfirm?: boolean
//   action?: string
//   // or just pass as children items
// }
interface DropdownMenuProps {
  children: ComponentChildren
  button: VNode
  mount?: boolean
  transform?: MenuTransform
  placement?: MenuPlacement
  className?: string
  onOpen?: VoidFunction
  onClose?: VoidFunction
  timeout?: number
  /* якщо в нас є компонент з модалкою - то потрібно не робити unmount  */
}
export const DropdownMenu: FC<DropdownMenuProps> = ({
  children,
  button,
  transform,
  placement,
  mount = false,
  onClose,
  onOpen,
  className,
  timeout,
}) => {
  const {value: isMenuOpen, setTrue: openMenu, setFalse: closeMenu} = useBoolean(false)

  const handleOpen = () => {
    onOpen?.()
    openMenu()
  }
  const handleClose = () => {
    onClose?.()
    closeMenu()
  }
  const cloned = cloneElement(button, {
    onClick: handleOpen,
  })

  return (
    <div class={`DropdownMenu ${isMenuOpen ? 'open' : ''}`}>
      {cloned}
      <Menu
        // withPortal
        className={className}
        autoClose
        isOpen={isMenuOpen}
        onClose={handleClose}
        transform={transform}
        timeout={timeout}
        withMount={mount}
        placement={placement}
      >
        {children}
      </Menu>
    </div>
  )
}
