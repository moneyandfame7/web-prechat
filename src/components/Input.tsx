import { FC, Ref, TargetedEvent } from 'preact/compat'
import { Signal, useSignal } from '@preact/signals'

import clsx from 'clsx'

import { Spinner } from './Spinner'
import { Transition } from './Transition'

import './Input.scss'

type InputHandler = (e: TargetedEvent<HTMLInputElement, Event>) => void

interface InputProps {
  elRef?: Ref<HTMLInputElement>
  id?: string
  value: string
  error?: string
  label?: string | Signal<string>
  disabled?: boolean
  placeholder?: string
  onInput: InputHandler
  onBlur?: InputHandler
  onFocus?: InputHandler
  onClick?: InputHandler
  onKeyDown?: (e: TargetedEvent<HTMLInputElement, KeyboardEvent>) => void
  maxLength?: number
  withIndicator?: boolean
  withArrow?: boolean
  loading?: boolean
  tabIndex?: number
  autoFocus?: boolean
}

export const InputText: FC<InputProps> = ({
  elRef,
  id,
  value,
  error,
  label,
  disabled,
  placeholder,
  maxLength,
  withIndicator,
  autoFocus = false,
  onInput,
  onBlur,
  onFocus,
  onKeyDown,
  loading = false,
  withArrow = false,
  tabIndex
}) => {
  const valueLength = useSignal(maxLength)
  const labelText = error || label
  const handleOnInput = (e: TargetedEvent<HTMLInputElement, Event>) => {
    e.preventDefault()
    const { value } = e.currentTarget
    if (typeof valueLength.value !== 'undefined' && typeof maxLength !== 'undefined') {
      valueLength.value = maxLength - value.length
    }

    onInput(e)
  }

  const handleOnFocus = (e: TargetedEvent<HTMLInputElement, Event>) => {
    e.preventDefault()
    onFocus?.(e)
  }

  const handleOnBlur = (e: TargetedEvent<HTMLInputElement, Event>) => {
    e.preventDefault()
    onBlur?.(e)
  }

  const buildedClassname = clsx('input-container', {
    'not-empty': value,
    'error': Boolean(error),
    'disabled': disabled,
    'with-arrow': withArrow
  })

  return (
    <div className={buildedClassname}>
      <input
        autoFocus={autoFocus}
        tabIndex={tabIndex}
        ref={elRef}
        id={id}
        onInput={handleOnInput}
        onBlur={handleOnBlur}
        onKeyDown={onKeyDown}
        onFocus={handleOnFocus}
        value={value}
        type="text"
        autoComplete="off"
        disabled={disabled}
        maxLength={maxLength}
        aria-label={labelText}
        placeholder={placeholder}
      />
      <div class="input-border" />

      <Transition
        className="fa-solid fa-chevron-down"
        isVisible={withArrow && !loading}
        type="zoomFade"
        withMount
        appear={false}
      />
      <Transition
        className="input-spinner"
        type="zoomFade"
        appear={false}
        withMount
        isVisible={loading}
      >
        <Spinner size="small" color="neutral" />
      </Transition>
      {labelText && <label htmlFor={id}>{labelText}</label>}
      {maxLength && withIndicator && <span class="length-indicator">{valueLength}</span>}
    </div>
  )
}
