import {useCallback, type FC, type TargetedEvent} from 'preact/compat'
import {type Signal} from '@preact/signals'

import type {InputHandlerValue, SignalOr} from 'types/ui'

import {InputText} from './Input'
import {Icon} from './Icon'

import './PasswordInput.scss'

interface PasswordInputProps {
  onInput: InputHandlerValue
  value: SignalOr<string>
  label?: SignalOr<string>
  showPassword: Signal<boolean>
  disabled?: SignalOr<boolean>
}
export const PasswordInput: FC<PasswordInputProps> = ({
  onInput,
  value,
  label,
  showPassword,
  disabled
}) => {
  const iconName = showPassword.value ? 'eyeOpen' : 'eyeClose'
  const changeInputType = () => {
    showPassword.value = !showPassword.value
  }
  const handleChange = useCallback(
    (e: TargetedEvent<HTMLInputElement, Event>) => {
      e.preventDefault()
      onInput(e.currentTarget.value)
    },
    [onInput]
  )

  return (
    <InputText
      disabled={disabled}
      className="PasswordInput"
      label={label}
      onInput={handleChange}
      value={value}
      endIcon={<Icon name={iconName} color="secondary" onClick={changeInputType} />}
      type={showPassword.value ? 'text' : 'password'}
    />
  )
}
