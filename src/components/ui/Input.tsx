import type {VNode, RefObject} from 'preact'
import {
  type FC,
  type TargetedEvent,
  useLayoutEffect,
  useEffect,
  useCallback
} from 'preact/compat'
import {useSignal} from '@preact/signals'

import clsx from 'clsx'

import type {InputHandler, SignalOr} from 'types/ui'
import type {AnyObject} from 'types/common'

import {isAnimationDisabled} from 'utilities/isAnimationEnabled'
import {getLengthMaybeSignal} from 'utilities/getLengthMaybeSignal'
import {Spinner} from './Spinner'
import {Icon, type IconName} from './Icon'

import './Input.scss'

export type InputVariant = 'filled' | 'outlined' | 'default'
interface InputProps {
  elRef?: RefObject<HTMLInputElement>
  id?: SignalOr<string>
  value: SignalOr<string>
  error?: SignalOr<string>
  label?: SignalOr<string>
  disabled?: SignalOr<boolean>
  placeholder?: SignalOr<string>
  onInput: InputHandler
  onBlur?: InputHandler
  onFocus?: InputHandler
  onClick?: InputHandler
  onKeyDown?: (e: TargetedEvent<HTMLInputElement, KeyboardEvent>) => void
  maxLength?: number
  withIndicator?: boolean
  loading?: boolean
  tabIndex?: number
  autoFocus?: boolean
  startIcon?: IconName
  endIcon?: VNode
  className?: string
  dataProps?: AnyObject
  'aria-label'?: SignalOr<string>
  type?: SignalOr<string>
  inputMode?: string
  variant?: InputVariant
  fixedLabel?: boolean
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
  withIndicator = maxLength ? true : false,
  autoFocus = false,
  onInput,
  onBlur,
  onFocus,
  onKeyDown,
  loading = false,
  tabIndex,
  startIcon,
  endIcon,
  className,
  dataProps,
  children,
  'aria-label': ariaLabel,
  type = 'text',
  inputMode,
  fixedLabel,
  variant = 'outlined'
}) => {
  const valueLength = useSignal(maxLength)
  const labelText = error || label
  const handleOnInput = (e: TargetedEvent<HTMLInputElement, Event>) => {
    e.preventDefault()
    const {value} = e.currentTarget
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

  const buildedClassname = clsx(className, 'input-container', `input-${variant}`, {
    'error': Boolean(error),
    'not-empty': Boolean(getLengthMaybeSignal(value)),
    'start-icon': Boolean(startIcon),
    'loading': loading,
    'end-icon': Boolean(endIcon) || typeof loading !== 'undefined',
    'fixed-label': fixedLabel || isAnimationDisabled() // if animation off
  })

  useLayoutEffect(() => {
    if (autoFocus && elRef?.current) {
      elRef.current.focus()
    }
  }, [])

  useEffect(() => {
    if (error) {
      elRef?.current?.blur()
    }
  }, [error])

  const renderEndIcon = useCallback(() => {
    return (
      <>
        {loading && (
          <span class="input-spinner">
            <Spinner size="small" color="neutral" />
          </span>
        )}
        {endIcon}
      </>
    )
  }, [endIcon, loading])

  return (
    <div className={buildedClassname} {...dataProps}>
      <input
        // autoFocus={autoFocus}
        inputMode={inputMode}
        tabIndex={tabIndex}
        ref={elRef}
        id={id}
        onInput={handleOnInput}
        onBlur={handleOnBlur}
        onKeyDown={onKeyDown}
        onFocus={handleOnFocus}
        value={value}
        type={type}
        autoComplete="off"
        disabled={disabled || loading}
        maxLength={maxLength}
        aria-label={ariaLabel || labelText}
        placeholder={placeholder}
      />
      {variant !== 'default' && <div class="input-border" />}
      {startIcon && <Icon name={startIcon} color="secondary" />}
      {renderEndIcon()}
      {labelText && (
        <label for={id} htmlFor={id}>
          {labelText}
        </label>
      )}
      {maxLength && withIndicator && <span class="length-indicator">{valueLength}</span>}
      {children}
    </div>
  )
}
