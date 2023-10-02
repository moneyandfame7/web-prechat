import type {RefObject} from 'preact'
import {type CSSProperties, type TargetedEvent} from 'preact/compat'
import {useCallback, useEffect, useLayoutEffect, useState} from 'preact/hooks'

import {TRANSITION_DURATION_MENU} from 'common/environment'

import {useBoolean} from './useFlag'

function getLimiterRect(
  containerRef?: RefObject<HTMLElement>,
  getLimiterElement?: () => HTMLElement | null
) {
  if (getLimiterElement) {
    const limiter = getLimiterElement()

    // console.log('RETURN LIMITER:', limiter)

    if (limiter) {
      return limiter.getBoundingClientRect()
    }
  }
  if (containerRef?.current) {
    const rect = containerRef.current.getBoundingClientRect()
    return rect
  }

  return {
    width: window.innerWidth,
    height: window.innerHeight,
    left: window.screenLeft,
    right: 0,
    top: window.screenTop,
  }
}

/* withPortal or not? */
export function useContextMenu(
  menuRef: RefObject<HTMLDivElement>,
  triggerRef: RefObject<HTMLElement>,
  getMenuElement: () => HTMLElement | null,
  getLimiterElement?: () => HTMLElement | null,
  withPortal = true,
  dynamicTransformOrigin?: boolean,
  disabled?: boolean
  // limiter?: 'trigger' | 'window' | 'custom' = 'trigger'
) {
  const {value, setFalse, setTrue} = useBoolean(false)
  const [position, setPosition] = useState<{x: number; y: number} | undefined>(undefined)
  const [styles, setStyles] = useState<CSSProperties>()
  const handleContextMenu = (e: TargetedEvent<Element, MouseEvent>) => {
    if (disabled) {
      return
    }
    // console.log({value, position, styles})
    // stopEvent(e)
    // console.log(e.target, e.currentTarget, menuRef.current)

    // коли клікаємо другий раз context menu, menuRef вже існує, тому в такий спосіб запобігаємо перевідкриванную меню
    const menuEl = getMenuElement()
    if (position || menuRef.current || menuEl) {
      setPosition(undefined)
      setStyles({})
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

  useLayoutEffect(() => {
    if (disabled) {
      return
    }
    // getMenuElement()
    const menuEl = menuRef.current
    const limiterEl = getLimiterElement?.()
    const container = getLimiterRect(triggerRef, getLimiterElement)

    const triggerRect = triggerRef.current?.getBoundingClientRect()
    const limiterRect = limiterEl?.getBoundingClientRect()
    const menuWidth = menuEl?.offsetWidth
    const menuHeight = menuEl?.offsetHeight
    // const limiterWidth = limiterEl?.offsetWidth || container?.offsetWidth || window.innerWidth

    /**
     * @todo container, or trigger, or window limiter for width.
     * also for Y
     * має вимикатись коли ще раз клацаємо контекст меню?
     * на телефоні шоб працювало
     */
    if (!position || !menuEl || !container || !menuWidth || !menuHeight || !triggerRect) {
      return
    }
    let {x, y} = position

    console.log(limiterEl)
    // console.log({y}, triggerRect.height, triggerRect.top)
    const additionalXForPortal = withPortal ? container.left : 0

    // const additionalYForPortal = withPortal ? triggerRect.top : 0
    // const calculatedXYithPortal = y - additionalXForPortal
    // console.log('LIMITER: ', limiterEl ? limiterEl : 'WINDOW')
    // const notInContainer = calculatedXWithPortal + menuWidth > container.width
    // console.log(calculatedXWithPortal > container.width / 2, 'RIGHT ORIGIN')
    const notInContainerX = limiterRect
      ? x + menuWidth > limiterRect.width
      : x > window.innerWidth - menuWidth
    // console.log({container, x, menuWidth}, notInContainer)
    const notInContainerY = limiterRect
      ? y + menuHeight > limiterRect.height
      : y > window.innerHeight - menuHeight

    if (notInContainerX) {
      if (limiterRect) {
        x = limiterRect.width - menuWidth - 5 /*  - (x - triggerRect.left) */
      } else {
        x = window.innerWidth - menuWidth - 10
      }
    }
    if (notInContainerY) {
      if (limiterRect) {
        y = limiterRect.height - menuHeight - 5
      } else {
        y = window.innerHeight - menuHeight - 10
      }
    }
    // const notInContainerY = calculatedXYithPortal + menuHeight > container.offsetHeight
    // console.log({y}, triggerRect.top, {menuHeight})

    // console.log({triggerRect, y})
    // const top = y - triggerRect.top + additionalYForPortal
    // y -= menuHeight

    // console.log('OFFSET:', y - additionalYForPortal, container.offsetHeight)

    // const test = container.offsetHeight + container.offsetTop - y
    // y = test
    // console.log({test})

    /* @!!!!@ */
    // if (notInContainer) {
    //   x = container.offsetWidth - menuWidth - 5 + additionalXForPortal
    // }
    // x = x > window.innerWidth - menuWidth ? window.innerWidth : x
    // if (!withPortal) {
    //   y += container.top
    // }
    /* IDK */
    // if (!withPortal) {
    //   x = triggerRef.current!.offsetLeft
    // }
    // console.log(triggerRef.current?.offsetLeft, x)

    // y = y + additionalYForPortal - triggerRect.top - top + menuHeight
    // y = y + menuHeight

    /**
     * додавати bottom, top
     */
    // const transformOrigin =
    //   calculatedXWithPortal > container.width / 2 ? 'top right' : 'top left'
    setStyles({
      left: x,
      top: y,
      transformOrigin: /* dynamicTransformOrigin ? transformOrigin :  */ 'top left',
    })
  }, [position, getMenuElement, withPortal, disabled])

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
