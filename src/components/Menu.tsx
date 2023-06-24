import { ComponentChildren } from 'preact'
import { FC, TargetedEvent, memo } from 'preact/compat'

import clsx from 'clsx'

import { IS_SENSOR } from 'common/config'

import { Transition } from './Transition'

import './Menu.scss'

interface MenuProps {
  className?: string
  children: ComponentChildren
  isOpen: boolean
  withMount?: boolean
}
export const Menu: FC<MenuProps> = memo(({ className, children, isOpen, withMount = true }) => {
  const buildedClass = `Menu scrollable ${className || ''}`

  return (
    <>
      <Transition
        className={buildedClass}
        isVisible={isOpen}
        withMount={withMount}
        appear={false}
        type="fade"
      >
        {children}
      </Transition>
    </>
  )
})

interface MenuItemProps {
  children: ComponentChildren
  className?: string
  onClick?: (e?: MouseEvent) => void
  hidden?: boolean
  selected?: boolean
}
export const MenuItem: FC<MenuItemProps> = memo(
  ({ children, className, hidden = false, selected = false, onClick }) => {
    const buildedClass = clsx('Menu_item', className, {
      'hidden': hidden,
      'selected': selected
    })
    const handleMouseDown = (e: TargetedEvent<HTMLDivElement, MouseEvent>) => {
      if (!IS_SENSOR && e.button === 0) {
        e.preventDefault()
        onClick?.()
      }
    }
    return (
      <div
        onClick={IS_SENSOR ? onClick : undefined}
        onMouseDown={handleMouseDown}
        class={buildedClass}
      >
        {children}
      </div>
    )
  }
)
