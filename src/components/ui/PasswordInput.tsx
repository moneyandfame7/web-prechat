import {type Signal} from '@preact/signals'
import {type FC, RefObject, type TargetedEvent, useCallback} from 'preact/compat'

import type {InputHandlerValue, SignalOr} from 'types/ui'

import {Icon} from './Icon'
import {InputText} from './Input'

import './PasswordInput.scss'

interface PasswordInputProps {
  onInput: InputHandlerValue
  value: SignalOr<string>
  label?: SignalOr<string>
  showPassword: Signal<boolean>
  disabled?: SignalOr<boolean>
  error?: SignalOr<string | undefined>
  autoFocus?: boolean
  elRef?: RefObject<HTMLInputElement>
}
export const PasswordInput: FC<PasswordInputProps> = ({onInput, showPassword, ...props}) => {
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
      {...props}
      className="PasswordInput"
      onInput={handleChange}
      endIcon={<Icon name={iconName} color="secondary" onClick={changeInputType} />}
      type={showPassword.value ? 'text' : 'password'}
    />
  )
}
