import {
  // isValidElement,
  memo,
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties
} from 'preact/compat'

import {usePrevious} from 'hooks'
import {useForceUpdate} from 'hooks/useForceUpdate'

import {Transition, type TransitionType} from './Transition'
import type {VNodeWithKey} from 'types/ui'

function getKey<TKey>(el: VNodeWithKey<TKey> | undefined) {
  if (typeof el === 'undefined') {
    return undefined
  }
  if (!el.key) {
    throw new Error(
      '[MountTransition] Was provided invalid element or not provided element key.'
    )
  }
  return el.key
}

function compareKeys<TKey>(
  el1: VNodeWithKey<TKey> | undefined,
  el2: VNodeWithKey<TKey> | undefined
) {
  if (typeof el1 === 'undefined' || typeof el2 === 'undefined') {
    return undefined
  }
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
    default:
      return name
  }
}

function getClassnameByKey<TKey extends string>(
  key: NonNullable<TKey> | undefined,
  classNames?: Record<TKey, string> | string
) {
  if (!classNames || !key) {
    return
  } else if (typeof classNames === 'string') {
    return classNames
  }
  return classNames[key]
}

function getCleanupElements<TKey>(
  key: NonNullable<TKey> | undefined,
  shouldCleanup: boolean | string[]
) {
  if (typeof shouldCleanup === 'boolean') {
    return shouldCleanup
  }
  const cleanupEl = shouldCleanup.find((el) => el === key)

  return Boolean(cleanupEl)
}

interface MountTransitionProps<TKey extends string> {
  children: VNodeWithKey<TKey> | undefined
  /* Whether remove from dom */
  shouldCleanup: boolean | TKey[]
  activeKey: TKey
  name?: TransitionType
  classNames?: Record<TKey, string> | string
  initial?: boolean
  duration?: number
  styles?: CSSProperties
  getTransitionForNew?: (
    newEl: VNodeWithKey<TKey>,
    current: VNodeWithKey<TKey>
  ) => TransitionType
  absoluted?: boolean
}
const MountTransition = <TKey extends string>({
  children,
  shouldCleanup,
  activeKey,
  classNames,
  name,
  initial = true,
  getTransitionForNew,
  duration,
  styles,
  absoluted
}: MountTransitionProps<TKey>) => {
  const renderCount = useRef(0)
  const [transition, setTransition] = useState<TransitionType>(name || 'fade')
  const elementsRef = useRef<(VNodeWithKey<TKey> | undefined)[]>([children])
  const willHide = usePrevious(children)
  const forceUpdate = useForceUpdate()
  const existIn = useCallback((element: VNodeWithKey<TKey> | undefined) => {
    return elementsRef.current.find((el) => compareKeys(el, element))
  }, [])

  useEffect(() => {
    if (!name && !getTransitionForNew) {
      throw new Error('[MountTransition]: Transition name or function not provided')
    }
    renderCount.current = 1
  }, [])
  useEffect(() => {
    const needToUpdate = !existIn(children)
    if (needToUpdate) {
      elementsRef.current = [...elementsRef.current, children]
    }
    forceUpdate()
  }, [children])

  const renderContent = useCallback(() => {
    if (!children) {
      return undefined
    }
    if (willHide && children.key !== willHide?.key) {
      const receivedTransition = getTransitionForNew?.(children, willHide)
      if (receivedTransition) {
        setTransition(receivedTransition)
      }
    }
    return elementsRef.current.map((el) => {
      const key = getKey(el)
      const isActive = activeKey === key
      return (
        <Transition
          /* avoid transition for first component render, but for other - ok */
          appear={initial || renderCount.current > 0}
          key={key}
          styles={styles}
          duration={duration}
          withMount={getCleanupElements(key, shouldCleanup)}
          // duration={initial ? duration || getTransitionDuration(name) + 1000 : undefined}
          isVisible={isActive}
          className={getClassnameByKey(key, classNames)}
          type={getTransitionType(isActive, transition)}
          absoluted={absoluted}
        >
          {el}
        </Transition>
      )
    })
  }, [activeKey, shouldCleanup, transition, children, willHide, name])

  return <>{renderContent()}</>
}

export default memo(MountTransition)
