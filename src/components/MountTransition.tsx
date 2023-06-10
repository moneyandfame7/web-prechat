/* eslint-disable no-console */
import { VNode } from 'preact'
import { FC, isValidElement, useCallback, useEffect, useRef, useState } from 'preact/compat'

import { Transition, TransitionType } from './Transition'

function getKey(el: VNode) {
  if (!isValidElement(el) || !el.key) {
    throw new Error('Was provided invalid element or not provided element key.')
  }
  return el.key as string
}

function compareKeys(el1: VNode, el2: VNode) {
  if (!el1.key || !el2.key) {
    throw new Error('Element key not provided')
  }
  return el1.key === el2.key
}
interface MountTransitionProps {
  children: VNode
  /* Remove from dom or not */
  shouldCleanup: boolean
  activeKey: string
  name: TransitionType
  className?: string
  initial?: boolean
  duration?: number
}

const getTransitionType = (isActive: boolean, name: TransitionType) => {
  switch (name) {
    case 'zoomSlideReverse':
      return isActive ? 'zoomFade' : 'slide'
    case 'zoomSlide':
      return isActive ? 'slide' : 'zoomFade'
    default:
      return name
  }
}
export const MountTransition: FC<MountTransitionProps> = ({
  children,
  shouldCleanup,
  activeKey,
  className,
  name,
  initial = true
}) => {
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
    console.log({ elements, children })
    if (needToUpdate) {
      setElements((prev) => [...prev, children])
    }
    /* Already in elements list */
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
