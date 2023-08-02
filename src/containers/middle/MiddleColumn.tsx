import {useRef, type FC, useState} from 'preact/compat'

import {Button} from 'components/ui'

import {SwitchTransition} from 'components/transitions'

import './MiddleColumn.scss'

export const MiddleColumn: FC = () => {
  const render = useRef(0)

  render.current += 1

  const [counter, setCounter] = useState(0)
  return (
    <div class="MiddleColumn">
      <div class="MiddleColumn-inner">
        <h1>{render.current}</h1>
        {counter}
        <Button
          onClick={() => {
            setCounter((prev) => ++prev)
          }}
        >
          Add 1 ids
        </Button>
      </div>
    </div>
  )
}
