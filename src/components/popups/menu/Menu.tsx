import type {ComponentChildren, RefObject} from 'preact'
import {
  CSSProperties,
  type FC,
  type TargetedEvent,
  memo,
  useCallback,
  useEffect,
  useRef,
} from 'preact/compat'

import clsx from 'clsx'

import {useClickAway} from 'hooks/useClickAway'

import {logDebugWarn} from 'lib/logger'

import {IS_SENSOR, TRANSITION_DURATION_MENU} from 'common/config'
import {addEscapeListener} from 'utilities/keyboardListener'
import {stopEvent} from 'utilities/stopEvent'

import {SingleTransition} from 'components/transitions'
import {Portal} from 'components/ui/Portal'

import {MenuProvider, useMenuContext} from './context'

import './Menu.scss'

export type MenuTransform =
  | 'bottom left'
  | 'bottom right'
  | 'default'
  | 'top right'
  | 'top left'
  | 'top center'
  | 'top'
  | 'center'
  | 'bottom'
export type MenuPlacement = {
  left?: boolean
  right?: boolean
  bottom?: boolean
  top?: boolean
}
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
  transform?: MenuTransform
  placement?: MenuPlacement
  containerRef?: RefObject<HTMLElement>
  elRef?: RefObject<HTMLDivElement>
  style?: CSSProperties
  withPortal?: boolean
  shouldHandleAwayClick?: boolean
  withLeave?: boolean
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
    transform = 'default',
    placement,
    containerRef,
    elRef,
    style,
    withPortal,
    shouldHandleAwayClick = true,
    withLeave,
  }) => {
    let menuRef = useRef<HTMLDivElement>(null)

    if (elRef) {
      menuRef = elRef
    }

    const buildedClass = clsx('Menu', className, 'scrollable', 'scrollable-y', {
      'Menu--bottom': placement?.bottom,
      'Menu--left': placement?.left,
      'Menu--right': placement?.right,
      'Menu--top': placement?.top,
    })

    const handleClickBackdrop = useCallback((e: TargetedEvent<HTMLDivElement, MouseEvent>) => {
      e.preventDefault()
      // e.stopImmediatePropagation()

      // stopEvent(e)
      onClose()
      logDebugWarn('[UI]: Menu backdrop click')
    }, [])

    useClickAway(
      containerRef || menuRef,
      (e, clicked) => {
        if (isOpen && (withBackdrop ? clicked.className !== 'backdrop' : true)) {
          e.preventDefault()
          // e.stopImmediatePropagation()
          // stopEvent(e)
          onClose()
          logDebugWarn('[UI]: Menu away click')
        }
      },
      !shouldHandleAwayClick || !isOpen
    )

    useEffect(() => {
      return isOpen
        ? addEscapeListener(() => {
            onClose()
          })
        : undefined
    }, [isOpen])
    // const isMouseIn = useRef(false)
    // useEffect(() => {
    //   console.log(isOpen, 'isMenuOver', isMouseIn.current)
    // }, [isOpen])
    // const timeoutRef = useRef<number | null>(null)
    // const handleMouseLeave = () => {
    //   // Відміна закриття, якщо воно було заплановано
    //   console.log('CLOSE MENU')

    //   timeoutRef.current = setTimeout(() => {
    //     onClose()
    //     isMouseIn.current = false
    //   }, 1000)

    //   // setMenuOpen(true);
    // }

    // const handleMouseEnter = () => {
    //   if (timeoutRef.current) {
    //     clearTimeout(timeoutRef.current)
    //   }
    //   isMouseIn.current = true
    //   console.log('OPEN MENU?')
    // }
    // useEffect(() => {
    //   // При розміщенні на елементі, очищаємо таймер (якщо він є)
    //   return () => {
    //     if (timeoutRef.current) {
    //       clearTimeout(timeoutRef.current)
    //     }
    //   }
    // }, [])
    const menu = (
      <MenuProvider
        props={{
          onClose,
          isOpen,
          autoClose,
        }}
      >
        {/* <Portal> */}
        <SingleTransition
          elRef={menuRef}
          className={buildedClass}
          styles={{transformOrigin: transform, ...style}}
          in={isOpen}
          name="zoomFade"
          unmount={withMount}
          // appear
          timeout={TRANSITION_DURATION_MENU}
        >
          <>{children}</>
        </SingleTransition>
        {isOpen && withBackdrop && <div class="backdrop" onMouseDown={handleClickBackdrop} />}
        {/* </Portal> */}
      </MenuProvider>
    )
    if (withPortal) {
      return <Portal>{menu}</Portal>
    }

    return menu
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
      hidden,
      selected,
    })
    const itemProps = {
      onClick: IS_SENSOR ? handleClick : undefined,
      onMouseDown: !IS_SENSOR ? handleMouseDown : undefined,
      class: buildedClass,
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
