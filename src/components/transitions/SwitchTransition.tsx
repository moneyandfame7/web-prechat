import {useState, useEffect, useCallback, memo, useRef, useMemo} from 'preact/compat'
import type {VNodeWithKey} from 'types/ui'

import {cloneElementWithKey} from 'utilities/cloneElementWithKey'
import {usePrevious} from 'hooks'

import {TransitionTest} from './Transition'
import type {SwitchTransitionProps, TransitionCases} from './types'
import {getTransitionProperty, getCleanupElements} from './helpers'
import clsx from 'clsx'

const SwitchTransition = <TKey extends string | number>({
  activeKey,
  shouldCleanup = true,
  initial,
  name,
  children,
  classNames,
  durations,
  cleanupException,
  permanentClassname,
  getTransitionByCase
}: SwitchTransitionProps<TKey>) => {
  const newEl: VNodeWithKey<TKey> = useMemo(
    () => cloneElementWithKey(children, activeKey),
    [activeKey, children]
  )

  const [elements, setElements] = useState<VNodeWithKey<TKey>[]>([newEl])

  const renderCount = useRef(0)
  const willExit = usePrevious(newEl)

  const transitions = useRef<TransitionCases | undefined>(
    getTransitionByCase?.(newEl.key, willExit?.key)
  )
  useEffect(() => {
    renderCount.current = 1
  }, [])

  const alreadyAdded = useCallback(
    (key: TKey) => {
      return elements.find((el) => el.key === key)
    },
    [elements]
  )

  useEffect(() => {
    if (!alreadyAdded(newEl.key)) {
      setElements((prev) => [...prev, newEl])
    } else {
      setElements((prev) => {
        return prev.map((el) => {
          if (el.key === newEl.key) {
            return newEl
          }
          return el
        })
      })
    }
  }, [newEl])
  const renderElements = () => {
    return elements.map((el) => {
      const isMounted = el.key === activeKey
      if (newEl.key !== willExit?.key) {
        transitions.current = getTransitionByCase?.(newEl.key, willExit?.key)
      }

      const transitionPropertiesByCase = isMounted
        ? transitions.current?.enter
        : transitions.current?.exit

      return (
        <TransitionTest
          isMounted={isMounted}
          name={transitionPropertiesByCase?.name || name}
          /**
           * renderCount.current > 0, because the component is not animated in the first mount unless you use this option
           */
          appear={getTransitionProperty(initial, el.key) || renderCount.current > 0}
          alwaysMounted={getCleanupElements(el.key, cleanupException, shouldCleanup)}
          duration={
            getTransitionProperty(durations, el.key) ??
            transitionPropertiesByCase?.duration ??
            0
          }
          className={clsx(getTransitionProperty(classNames, el.key), permanentClassname)}
        >
          {el}
        </TransitionTest>
      )
    })
  }

  return <>{renderElements()}</>
}

export default memo(SwitchTransition)
