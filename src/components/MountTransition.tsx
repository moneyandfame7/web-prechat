import { VNode } from 'preact'
import { FC, isValidElement, memo, useCallback, useEffect, useRef, useState } from 'preact/compat'

import { throwDebugError } from 'common/functions'

import { Transition, TransitionType } from './Transition'

function getKey(el: VNode) {
  if (!isValidElement(el) || !el.key) {
    throwDebugError('[MountTransition] Was provided invalid element or not provided element key.')
  }
  return el.key as string
}

function compareKeys(el1: VNode, el2: VNode) {
  if (!el1.key || !el2.key) {
    throwDebugError('[MountTransition] Element key not provided')
  }
  return el1.key === el2.key
}
interface MountTransitionProps {
  children: VNode
  /* Whether remove from dom */
  shouldCleanup: boolean
  activeKey: string
  name: TransitionType
  className?: string
  initial?: boolean
  duration?: number
}

function getTransitionType(isActive: boolean, name: TransitionType) {
  switch (name) {
    case 'zoomSlideReverse':
      return isActive ? 'zoomFade' : 'slide'
    case 'zoomSlide':
      return isActive ? 'slide' : 'zoomFade'
    default:
      return name
  }
}
export const MountTransition: FC<MountTransitionProps> = memo(
  ({ children, shouldCleanup, activeKey, className, name, initial = true }) => {
    const renderCount = useRef(0)
    const [elements, setElements] = useState<VNode[]>([children])
    const existIn = useCallback(
      (element: VNode) => {
        return elements.find((el) => compareKeys(el, element))
      },
      [elements]
    )
    useEffect(() => {
      renderCount.current = 1
    }, [])
    useEffect(() => {
      const needToUpdate = !existIn(children)
      if (needToUpdate) {
        setElements((prev) => [...prev, children])
      }
    }, [children])
    const renderContent = useCallback(() => {
      return elements.map((el) => {
        const key = getKey(el)
        const isActive = activeKey === key
        return (
          <Transition
            /* avoid transition for first component render, but for other - ok */
            appear={initial || renderCount.current > 0}
            key={key}
            withMount={shouldCleanup}
            // duration={initial ? duration || getTransitionDuration(name) + 1000 : undefined}
            isVisible={isActive}
            className={className}
            type={getTransitionType(isActive, name)}
          >
            {el}
          </Transition>
        )
      })
    }, [elements, activeKey, shouldCleanup])
    return <>{renderContent()}</>
  }
)
