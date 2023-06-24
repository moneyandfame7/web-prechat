import { FC } from 'preact/compat'

import './Checkbox.scss'

interface CheckboxProps {
  label?: string
  onToggle: () => void
  checked: boolean
}
export const Checkbox: FC<CheckboxProps> = ({ label, onToggle, checked }) => {
  return (
    <label class="Checkbox">
      <input type="checkbox" onChange={onToggle} checked={checked} />
      {label}
    </label>
  )
}
