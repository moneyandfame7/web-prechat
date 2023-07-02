import { FC, TargetedEvent, useCallback } from 'preact/compat'
import { Signal } from '@preact/signals'

import { Ripple } from './Ripple'

import './Checkbox.scss'

interface CheckboxProps {
  label?: string | Signal<string>
  onToggle: (checked: boolean) => void
  checked: boolean | Signal<boolean>
}
export const Checkbox: FC<CheckboxProps> = ({ label, onToggle, checked }) => {
  const handleChange = useCallback((e: TargetedEvent<HTMLInputElement, Event>) => {
    onToggle(e.currentTarget.checked)
  }, [])

  return (
    <label class="Checkbox">
      <input type="checkbox" onChange={handleChange} checked={checked} />
      {label}
      <Ripple />
    </label>
  )
}
