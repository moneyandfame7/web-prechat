import { FC, TargetedEvent } from 'preact/compat'

import { useSignal } from '@preact/signals'

import clsx from 'clsx'

import './Input.scss'

interface InputProps {
  id?: string
  value: string
  error?: string
  label?: string
  disabled?: boolean
  placeholder?: string
  onInput: (value: string) => void
  onBlur?: () => void
  onFocus?: () => void
  maxLength?: number
}
export const InputText: FC<InputProps> = ({
  ref,
  id,
  value,
  error,
  label,
  disabled,
  placeholder,
  maxLength,
  onInput,
  onBlur,
  onFocus
}) => {
  const valueLength = useSignal(maxLength)
  const labelText = error || label

  const handleOnInput = (e: TargetedEvent<HTMLInputElement, Event>) => {
    e.preventDefault()
    const { value } = e.currentTarget
    if (typeof valueLength.value !== 'undefined' && typeof maxLength !== 'undefined') {
      valueLength.value = maxLength - value.length
    }
    onInput(e.currentTarget.value)
  }

  const buildedClassname = clsx('input-container', {
    'not-empty': value,
    'error': Boolean(error),
    'disabled': disabled
  })
  return (
    <div className={buildedClassname}>
      <input
        ref={ref}
        id={id}
        onInput={handleOnInput}
        onBlur={onBlur}
        onFocus={onFocus}
        value={value}
        type="text"
        autoComplete="off"
        disabled={disabled}
        maxLength={maxLength}
        aria-label={labelText}
        placeholder={placeholder}
      />
      <div class="input-border" />
      {labelText && <label htmlFor={id}>{labelText}</label>}
      {maxLength && <span class="length-indicator">{valueLength}</span>}
    </div>
  )
}
