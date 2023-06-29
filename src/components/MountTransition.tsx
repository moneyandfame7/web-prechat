import { VNode } from 'preact'
import { FC, isValidElement, memo, useCallback, useEffect, useRef, useState } from 'preact/compat'

import { usePrevious } from 'hooks'

import { Transition, TransitionType } from './Transition'

function getKey(el: VNode) {
  if (!isValidElement(el) || !el.key) {
    throw new Error('[MountTransition] Was provided invalid element or not provided element key.')
  }
  return el.key as string
}

function compareKeys(el1: VNode, el2: VNode) {
  if (!el1.key || !el2.key) {
    throw new Error('[MountTransition] Element key not provided')
  }
  return el1.key === el2.key
}

function getTransitionType(isActive: boolean, name: TransitionType) {
  switch (name) {
    case 'zoomSlideReverse':
      return isActive ? 'zoomFade' : 'slide'
    case 'zoomSlide':
      return isActive ? 'slide' : 'zoomFade'
    case 'slideReverse':
      return isActive ? 'slideFromRight' : 'slideFromLeft'
    default:
      return name
  }
}

function getClassnameByKey(key: string, classNames?: Record<string, string> | string) {
  if (!classNames) {
    return
  } else if (typeof classNames === 'string') {
    return classNames
  }
  return classNames[key]
}

interface MountTransitionProps {
  children: VNode
  /* Whether remove from dom */
  shouldCleanup: boolean
  activeKey: string
  name?: TransitionType
  classNames?: Record<string, string> | string
  initial?: boolean
  duration?: number
  getTransitionForNew?: (newEl: VNode, current: VNode) => TransitionType
}
export const MountTransition: FC<MountTransitionProps> = memo(
  ({
    children,
    shouldCleanup,
    activeKey,
    classNames,
    name,
    initial = true,
    getTransitionForNew
  }) => {
    const renderCount = useRef(0)
    const [transition, setTransition] = useState<TransitionType>(name || 'fade')
    const [elements, setElements] = useState<VNode[]>([children])
    const willHide = usePrevious(children)

    const existIn = useCallback(
      (element: VNode) => {
        return elements.find((el) => compareKeys(el, element))
      },
      [elements]
    )
    useEffect(() => {
      if (!name && !getTransitionForNew) {
        throw new Error('[MountTransition]: Transition name or function not provided')
      }
      renderCount.current = 1
    }, [])
    useEffect(() => {
      const needToUpdate = !existIn(children)
      if (needToUpdate) {
        setElements((prev) => [...prev, children])
      }
    }, [children])

    const renderContent = useCallback(() => {
      if (willHide && children.key !== willHide?.key) {
        const gettedTransition = getTransitionForNew?.(children, willHide)
        if (gettedTransition) {
          setTransition(gettedTransition)
        }
      }
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
            className={getClassnameByKey(key, classNames)}
            type={getTransitionType(isActive, transition)}
          >
            {el}
          </Transition>
        )
      })
    }, [elements, activeKey, shouldCleanup, transition, children, willHide])

    return <>{renderContent()}</>
  }
)
