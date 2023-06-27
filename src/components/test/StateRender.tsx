import { useSignal } from '@preact/signals'
import { FC, useRef } from 'preact/compat'

export const StateRenderTest: FC = () => {
  const render = useRef(0)
  const counter = useSignal(0)

  render.current += 1
  return (
    <h1
      onClick={() => {
        counter.value += 1
      }}
    >
      {render.current}
      {'  '}
      {counter}
    </h1>
  )
}
