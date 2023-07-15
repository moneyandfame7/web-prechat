import {FC, TargetedEvent, useCallback} from 'preact/compat'
import {Signal} from '@preact/signals'

import {Icon} from 'components/ui'
import {Transition} from 'components/Transition'

import {Ripple} from '../Ripple'

import './Checkbox.scss'

interface CheckboxProps {
  id?: string
  label?: string | Signal<string>
  onToggle: (checked: boolean) => void
  checked: boolean | Signal<boolean>
  withRipple?: boolean
}

export const Checkbox: FC<CheckboxProps> = ({
  label,
  onToggle,
  checked,
  withRipple = true,
  id
}) => {
  const handleChange = useCallback(
    (e: TargetedEvent<HTMLInputElement, Event>) => {
      onToggle(e.currentTarget.checked)
    },
    []
  )

  return (
    <label htmlFor={id} class="Checkbox">
      <input
        id={id}
        type="checkbox"
        onChange={handleChange}
        checked={checked}
      />
      {label}
      <Transition
        appear={false}
        withMount={false}
        type="zoomFade"
        isVisible={checked instanceof Signal ? checked.value : checked}
      >
        <Icon name="check" width={15} height={15} />
      </Transition>
      {withRipple && <Ripple />}
    </label>
  )
}
