import type {FC, TargetedEvent} from 'preact/compat'
import {useCallback} from 'preact/compat'
import type {Signal} from '@preact/signals'
import clsx from 'clsx'

import {Icon} from 'components/ui'

import {Ripple} from '../Ripple'

import './Checkbox.scss'

interface CheckboxProps {
  id?: string
  label?: string | Signal<string>
  onToggle: (checked: boolean) => void
  checked: boolean | Signal<boolean>
  withRipple?: boolean
  disabled?: boolean | Signal<boolean>
}

export const Checkbox: FC<CheckboxProps> = ({
  label,
  onToggle,
  checked,
  withRipple = true,
  disabled,
  id
}) => {
  const handleChange = useCallback((e: TargetedEvent<HTMLInputElement, Event>) => {
    onToggle(e.currentTarget.checked)
  }, [])

  const buildedClass = clsx('Checkbox', {
    'disabled': disabled
  })
  return (
    <label htmlFor={id} class={buildedClass}>
      <input
        id={id}
        type="checkbox"
        onChange={handleChange}
        checked={checked}
        disabled={disabled}
      />
      {label}
      {/* <Transition
        appear={false}
        withMount={false}
        type="zoomFade"
        isVisible={checked instanceof Signal ? checked.value : checked}
      > */}
      <Icon name="check" width={15} height={15} />
      {/* </Transition> */}
      {withRipple && <Ripple />}
    </label>
  )
}
