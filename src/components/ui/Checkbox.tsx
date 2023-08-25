import type {Signal} from '@preact/signals'
import {type FC, type TargetedEvent, useCallback} from 'preact/compat'

import clsx from 'clsx'

import type {SignalOr} from 'types/ui'

import {Icon} from 'components/ui'

import {Ripple} from '../Ripple'

import './Checkbox.scss'

interface CheckboxProps {
  id?: string
  label?: string | Signal<string>
  onToggle?: (checked: boolean) => void
  checked?: SignalOr<boolean>
  withRipple?: boolean
  disabled?: SignalOr<boolean>
}

export const Checkbox: FC<CheckboxProps> = ({
  label,
  onToggle,
  checked,
  withRipple = true,
  disabled,
  id,
}) => {
  const handleChange = useCallback((e: TargetedEvent<HTMLInputElement, Event>) => {
    onToggle?.(e.currentTarget.checked)
  }, [])

  const buildedClass = clsx('Checkbox', {
    disabled,
    ripple: withRipple,
  })
  /* подумати потім, як переробити щоб працювали signals */
  // https://codepen.io/bradyhullopeter/pen/bGrjzJy

  return (
    <label htmlFor={id} class={buildedClass}>
      <div class="Checkbox-wrapper">
        <input id={id} type="checkbox" onChange={handleChange} checked={checked} />
        {/* <Transition
        appear={false}
        withMount={false}
        type="zoomFade"
        isVisible={checked instanceof Signal ? checked.value : checked}
      > */}
        <Icon name="check" width={15} height={15} />
      </div>
      {label}

      {/* </Transition> */}
      {withRipple && <Ripple />}
    </label>
  )
}
