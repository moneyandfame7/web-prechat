import {useSignal} from '@preact/signals'
import type {RefObject, VNode} from 'preact'
import {
  type FC,
  type TargetedEvent,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
} from 'preact/compat'

import clsx from 'clsx'

import {getLengthMaybeSignal} from 'utilities/getLengthMaybeSignal'
import {getSignalOr} from 'utilities/getSignalOr'
import {isAnimationDisabled} from 'utilities/isAnimationEnabled'

import type {AnyObject} from 'types/common'
import type {InputHandler, PreactNode, SignalOr} from 'types/ui'

import {Transition} from 'components/transitions'

import {Icon, type IconName} from './Icon'
import {Spinner} from './Spinner'

import './Input.scss'

export type InputVariant = 'filled' | 'outlined' | 'default'
interface InputProps {
  elRef?: RefObject<HTMLInputElement>
  id?: SignalOr<string>
  value: SignalOr<string>
  error?: SignalOr<string | undefined>
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
  startIcon?: PreactNode
  endIcon?: VNode
  className?: string
  dataProps?: AnyObject
  'aria-label'?: SignalOr<string>
  type?: SignalOr<string>
  inputMode?: string
  variant?: InputVariant
  fixedLabel?: boolean
  pattern?: string
  autoComplete?: SignalOr<string>
  autoCorrect?: SignalOr<string>
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
  pattern,
  withIndicator = !!maxLength,
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
  variant = 'outlined',
  autoComplete,
  autoCorrect,
}) => {
  const valueLength = useSignal(maxLength)
  const labelText = getSignalOr(error) || getSignalOr(label)
  let ref = useRef<HTMLInputElement>(null)
  if (elRef) {
    ref = elRef
  }
  // const inputRef = useRef(elRef || null)
  const handleOnInput = (e: TargetedEvent<HTMLInputElement, Event>) => {
    e.preventDefault()
    const {value} = e.currentTarget
    if (typeof valueLength.value !== 'undefined' && typeof maxLength !== 'undefined') {
      valueLength.value = maxLength - value.length
    }

    onInput(e)
  }
  const handleOnFocus = (e: TargetedEvent<HTMLInputElement, Event>) => {
    // elRef?.current?.focus()
    onFocus?.(e)
    // e.preventDefault()
  }

  const handleOnBlur = (e: TargetedEvent<HTMLInputElement, Event>) => {
    e.preventDefault()
    onBlur?.(e)
  }

  const buildedClassname = clsx(className, 'input-container', `input-${variant}`, {
    error: Boolean(getSignalOr(error)),
    'not-empty': Boolean(getLengthMaybeSignal(value)),
    'start-icon': Boolean(startIcon),
    loading,
    'end-icon': Boolean(endIcon) || typeof loading !== 'undefined',
    'fixed-label': fixedLabel || isAnimationDisabled(), // if animation off
  })

  useLayoutEffect(() => {
    if (autoFocus && ref?.current) {
      ref?.current.focus()
    }
  }, [])

  useEffect(() => {
    if (getSignalOr(error)) {
      ref?.current?.blur()
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
        autoCorrect={autoCorrect}
        autocomplete={autoComplete}
        pattern={pattern}
        inputMode={inputMode}
        tabIndex={tabIndex}
        ref={ref}
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
      {/* {startIcon && <Icon name={startIcon} color="secondary" />} */}
      {/* {renderStartIcon()} */}
      {startIcon}
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
