/* eslint-disable no-console */
import { VNode } from 'preact'
import {
  FC,
  isValidElement,
  useCallback,
  useEffect,
  useState
} from 'preact/compat'

import { useSignal } from '@preact/signals'

import '../app.scss'
import { Transition } from './Transition'

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
type AnimationName = 'fade'
interface MountTransitionProps {
  children: VNode
  shouldCleanup: boolean
  activeKey: string
  name: AnimationName
}

export const MountTransition: FC<MountTransitionProps> = ({
  children,
  shouldCleanup,
  activeKey
  // name
}) => {
  const renderCount = useSignal(0)
  const [elements, setElements] = useState<VNode[]>([children])
  const existIn = useCallback(
    (element: VNode) => {
      return elements.find((el) => compareKeys(el, element))
    },
    [elements]
  )
  useEffect(() => {
    renderCount.value = 1
  }, [])

  useEffect(() => {
    const needToUpdate = !existIn(children)

    if (needToUpdate) {
      setElements((prev) => [...prev, children])
    } else {
      // console.log('[TRANSITION]: COMPONENT ALREADY EXIST IN LIST')
    }
  }, [children])

  const renderContent = useCallback(() => {
    return elements.map((el) => {
      const key = getKey(el)
      const isActive = activeKey === key
      return (
        <Transition
          appear={renderCount.value > 1}
          key={key}
          withMount={shouldCleanup}
          duration={150}
          isVisible={isActive}
          className="transition"
        >
          {el}
        </Transition>
      )
    })
  }, [elements, activeKey, shouldCleanup])
  return (
    <div data-component="Transition" style={{ height: '100%', width: '100%' }}>
      {renderContent()}
    </div>
  )
}
