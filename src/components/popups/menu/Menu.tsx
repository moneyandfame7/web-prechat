import type {ComponentChildren, RefObject} from 'preact'
import type {FC, TargetedEvent} from 'preact/compat'
import {memo, useCallback, useRef} from 'preact/compat'

import clsx from 'clsx'

import {IS_SENSOR, TRANSITION_DURATION_MENU} from 'common/config'
import {logDebugWarn} from 'lib/logger'

import {useClickAway} from 'hooks/useClickAway'

import {Transition} from 'components/Transition'

import {MenuProvider, useMenuContext} from './context'

import './Menu.scss'

type MenuPlacement =
  | 'bottom left'
  | 'bottom right'
  | 'default'
  | 'top right'
  | 'top left'
  | 'top center'
  | 'top'
  | 'center'
  | 'bottom'
interface MenuProps {
  className?: string
  children: ComponentChildren
  isOpen: boolean
  withMount?: boolean
  /**
   * @default true
   */
  autoClose?: boolean
  onClose: () => void
  withBackdrop?: boolean
  placement?: MenuPlacement
  containerRef?: RefObject<HTMLElement>
}

export const Menu: FC<MenuProps> = memo(
  ({
    className,
    children,
    isOpen,
    withMount = true,
    onClose,
    autoClose = true,
    withBackdrop = true,
    placement = 'default',
    containerRef
  }) => {
    const buildedClass = clsx('Menu', className, 'scrollable')

    const handleClickBackdrop = useCallback(
      (e: TargetedEvent<HTMLDivElement, MouseEvent>) => {
        e.preventDefault()
        onClose()
        logDebugWarn('[UI]: Menu backdrop click')
      },
      []
    )
    const menuRef = useRef<HTMLDivElement>(null)

    useClickAway(containerRef || menuRef, (e, clicked) => {
      if (isOpen && (withBackdrop ? clicked.className !== 'backdrop' : true)) {
        e.preventDefault()

        onClose()
        logDebugWarn('[UI]: Menu away click')
      }
    })
    return (
      <MenuProvider
        props={{
          onClose,
          isOpen,
          autoClose
        }}
      >
        <Transition
          elRef={menuRef}
          className={buildedClass}
          styles={{
            transformOrigin: placement
          }}
          isVisible={isOpen}
          withMount={withMount}
          appear={false}
          duration={TRANSITION_DURATION_MENU}
          type="zoomFade"
        >
          {children}
        </Transition>
        {isOpen && withBackdrop && (
          <div class="backdrop" onMouseDown={handleClickBackdrop} />
        )}
      </MenuProvider>
    )
  }
)

interface MenuItemProps {
  children: ComponentChildren
  className?: string
  onClick?: (e?: MouseEvent) => void
  hidden?: boolean
  selected?: boolean
  to?: string
}
export const MenuItem: FC<MenuItemProps> = memo(
  ({children, className, hidden = false, selected = false, onClick, to}) => {
    const {onClose, autoClose} = useMenuContext()

    const handleClick = useCallback(
      (e: TargetedEvent<HTMLDivElement | HTMLAnchorElement, MouseEvent>) => {
        e.preventDefault()
        autoClose && onClose()
        onClick?.()
      },
      [onClick, autoClose, onClose]
    )

    const handleMouseDown = useCallback(
      (e: TargetedEvent<HTMLDivElement | HTMLAnchorElement, MouseEvent>) => {
        if (!IS_SENSOR && e.button === 0) {
          handleClick(e)
        }
      },
      [handleClick]
    )

    const buildedClass = clsx('Menu_item', className, {
      'hidden': hidden,
      'selected': selected
    })
    const itemProps = {
      onClick: IS_SENSOR ? handleClick : undefined,
      onMouseDown: !IS_SENSOR ? handleMouseDown : undefined,
      class: buildedClass
    }
    return (
      <>
        {to ? (
          <a {...itemProps} href={to} target="_blank" rel="noreferrer">
            {children}
          </a>
        ) : (
          <div {...itemProps}>{children}</div>
        )}
        {/* <div
          onClick={IS_SENSOR ? handleClick : undefined}
          onMouseDown={!IS_SENSOR ? handleMouseDown : undefined}
          class={buildedClass}
        >
          {children}
        </div> */}
      </>
    )
  }
)
