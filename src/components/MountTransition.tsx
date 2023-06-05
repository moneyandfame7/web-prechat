/* eslint-disable no-console */
import {
  FC,
  isValidElement,
  useCallback,
  useEffect,
  useRef,
  useState
} from 'preact/compat'

import { VNode } from 'preact'

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

interface MountTransitionProps {
  children: VNode
  shouldCleanup: boolean
  activeKey: string
}
export const MountTransition: FC<MountTransitionProps> = ({
  children,
  shouldCleanup,
  activeKey
}) => {
  const [elements, setElements] = useState<VNode[]>([children])
  const existIn = useCallback(
    (element: VNode) => {
      return elements.find((el) => compareKeys(el, element))
    },
    [elements]
  )
  const renderCount = useRef(0)
  renderCount.current += 1
  useEffect(() => {
    const needToUpdate = !existIn(children)

    if (needToUpdate) {
      // console.log('[TRANSITION]: NEW COMPONENT WAS ADDED TO LIST')
      setElements((prev) => [...prev, children])
    } else {
      // console.log('[TRANSITION]: COMPONENT ALREADY EXIST IN LIST')
    }
  }, [children])

  const renderContent = useCallback(() => {
    console.log('[TRANSITION]: RERENDER')
    return elements.map((el) => {
      const key = getKey(el)
      const isActive = activeKey === key
      return (
        <Transition
          appear
          key={key}
          withMount={shouldCleanup}
          duration={150}
          isVisible={isActive}
          className="transition"
        >
          <div key={key} style={{ background: 'white' }}>
            {el}
          </div>
        </Transition>
      )
    })
  }, [elements, activeKey, shouldCleanup])
  return (
    <div data-component="Transition">
      <h1 style={{ position: 'absolute', top: 500 }}>{renderCount.current}</h1>
      {renderContent()}
    </div>
  )
}
