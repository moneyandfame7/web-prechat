import type {RefObject} from 'preact'
import {type CSSProperties, type TargetedEvent} from 'preact/compat'
import {useCallback, useEffect, useState} from 'preact/hooks'

import {useBoolean} from './useFlag'

/* withPortal or not? */
export function useContextMenu(
  menuRef: RefObject<HTMLDivElement>,
  triggerRef: RefObject<HTMLElement>,
  getMenuElement: () => HTMLElement | null,
  _getLimiterElement?: () => HTMLElement | null,
  withPortal?: boolean
  // limiter?: 'trigger' | 'window' | 'custom' = 'trigger'
) {
  const {value, setFalse, setTrue} = useBoolean(false)
  const [position, setPosition] = useState<{x: number; y: number} | undefined>(undefined)
  const [styles, setStyles] = useState<CSSProperties>()
  const handleContextMenu = (e: TargetedEvent<Element, MouseEvent>) => {
    // console.log({value, position, styles})
    // stopEvent(e)
    // console.log(e.target, e.currentTarget, menuRef.current)

    // коли клікаємо другий раз context menu, menuRef вже існує, тому в такий спосіб запобігаємо перевідкриванную меню
    const menuEl = getMenuElement()
    if (position || menuRef.current || menuEl) {
      setPosition(undefined)
      setFalse()
      return
    }
    e.preventDefault()

    setTrue()

    if (withPortal) {
      setPosition({x: e.clientX, y: e.clientY})
    } else {
      setPosition({x: e.offsetX, y: e.offsetY})
    }
    // setPosition({x: e.clientX, y: e.clientY})

    // setContainerPosition({})
  }

  useEffect(() => {
    // getMenuElement()
    const menuEl = menuRef.current
    // const containerEl = getContainerElement()
    // const limiterEl = getLimiterElement?.()
    const container = triggerRef.current
    const menuWidth = menuEl?.offsetWidth
    const menuHeight = menuEl?.offsetHeight
    // const limiterWidth = limiterEl?.offsetWidth || container?.offsetWidth || window.innerWidth

    /**
     * @todo container, or trigger, or window limiter for width.
     * also for Y
     * має вимикатись коли ще раз клацаємо контекст меню?
     * на телефоні шоб працювало
     */
    if (!position || !menuEl || !container || !menuWidth || !menuHeight) {
      return
    }
    const triggerRect = container.getBoundingClientRect()
    // const menuRect = menuEl.getBoundingClientRect()
    let {x, y} = position
    // console.log({y}, triggerRect.height, triggerRect.top)
    const additionalXForPortal = withPortal ? triggerRect.left : 0
    const calculatedXWithPortal = x - additionalXForPortal

    // const additionalYForPortal = withPortal ? triggerRect.top : 0
    // const calculatedXYithPortal = y - additionalXForPortal

    const notInContainer = calculatedXWithPortal + menuWidth > container.offsetWidth
    // const notInContainerY = calculatedXYithPortal + menuHeight > container.offsetHeight
    // console.log({y}, triggerRect.top, {menuHeight})

    // console.log({triggerRect, y})
    // const top = y - triggerRect.top + additionalYForPortal
    // y -= menuHeight

    // console.log('OFFSET:', y - additionalYForPortal, container.offsetHeight)

    // const test = container.offsetHeight + container.offsetTop - y
    // y = test
    // console.log({test})
    if (notInContainer) {
      x = container.offsetWidth - menuWidth - 5 + additionalXForPortal
    }
    if (!withPortal) {
      y += container.offsetTop
    }
    // y = y + additionalYForPortal - triggerRect.top - top + menuHeight
    // y = y + menuHeight
    /**
     * додавати bottom, top
     */
    const transformOrigin =
      calculatedXWithPortal > container.offsetWidth / 2 ? 'top right' : 'top left'

    setStyles({
      left: x,
      top: y,
      transformOrigin,
    })
  }, [position, getMenuElement, withPortal])

  const handleContextMenuClose = useCallback(() => {
    setFalse()
    setPosition(undefined)
  }, [])
  return {
    styles,
    handleContextMenu,
    handleContextMenuClose,
    isContextMenuOpen: value,
  }
}
