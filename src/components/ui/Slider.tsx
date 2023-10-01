import {type Signal, useComputed} from '@preact/signals'
import {type ChangeEvent, type FC, type TargetedEvent, useCallback} from 'preact/compat'

import './Slider.scss'

interface SliderProps {
  min: number
  max: number
  value: Signal<number>
  onChange: (range: number) => void
}

/*
max 20 - 100%
5      -  x%
*/

const Slider: FC<SliderProps> = ({min, max, value, onChange}) => {
  const progressWidth = `${((value.value - min) / (max - min)) * 100}%`
  const handleChange = useCallback((e: TargetedEvent<HTMLInputElement, ChangeEvent>) => {
    onChange(+e.currentTarget.value)
  }, [])

  return (
    <div class="input-slider-wrapper">
      <div class="input-slider-progress" style={{width: progressWidth}} />
      <input
        value={value}
        min={min}
        max={max}
        type="range"
        class="input-slider"
        onInput={handleChange}
      />
    </div>
  )
}

export {Slider}
