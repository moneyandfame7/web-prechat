import {type FC, useRef, useState} from 'preact/compat'

import {Button} from 'components/ui'

import {Transition} from '.'

import './Transition3d.scss'

enum Test {
  First,
  Second,
}
const Transition3d: FC = () => {
  const isNext = useRef(false)
  const [activeKey, setActiveKey] = useState(Test.First)
  const setPrev = () => {
    isNext.current = false
    setActiveKey(Test.First)
  }
  const setNext = () => {
    isNext.current = false
    setActiveKey(Test.Second)
  }
  return (
    <>
      <Transition
        shouldCleanup
        direction={isNext.current ? 1 : 'auto'}
        activeKey={activeKey}
        name="rotate3d"
        innerClassnames={'card'}
        timeout={1000}
        // innerClassnames={{
        // [Test.First]: 'cube__face cube__face--front ',
        // [Test.Second]: 'cube__face cube__face--right ',
        // }}
      >
        <div class="inner">Active - {Test[activeKey]}</div>
      </Transition>

      <Button onClick={setPrev}>Prev</Button>

      <Button onClick={setNext}>Next</Button>
      {/* <p
        class="radio-group"
        onChange={() => {
          changeSide()
        }}
      >
        <label>
          <input type="radio" name="rotate-cube-side" value="front" checked /> front
        </label>
        <label>
          <input type="radio" name="rotate-cube-side" value="right" /> right
        </label>
      </p> */}
    </>
  )
}

export {Transition3d}
