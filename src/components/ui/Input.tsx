import { type VNode, type RefObject } from 'preact'
import { type FC, type TargetedEvent, useLayoutEffect, useEffect, useCallback } from 'preact/compat'
import { useSignal } from '@preact/signals'

import clsx from 'clsx'

import type { InputHandler, SignalOrString } from 'types/ui'
import type { AnyObject } from 'types/common'

import { Spinner } from './Spinner'
import { Transition } from '../Transition'

import './Input.scss'

interface InputProps {
  elRef?: RefObject<HTMLInputElement>
  id?: SignalOrString
  value: string
  error?: SignalOrString
  label?: SignalOrString
  disabled?: boolean
  placeholder?: SignalOrString
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
  startIcon?: VNode
  endIcon?: VNode
  className?: string
  dataProps?: AnyObject
  'aria-label'?: SignalOrString
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
  'aria-label': ariaLabel
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

  const isInputDisabled = disabled || loading

  const buildedClassname = clsx(className, 'input-container', {
    'not-empty': Boolean(value.length),
    'error': Boolean(error),
    'disabled': isInputDisabled,
    'start-icon': Boolean(startIcon),
    'end-icon': Boolean(endIcon) || typeof loading !== 'undefined'
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
        <Transition
          className="input-spinner"
          type="zoomFade"
          appear={false}
          withMount
          isVisible={loading}
        >
          <Spinner size="small" color="neutral" />
        </Transition>

        {endIcon && (
          <Transition type="zoomFade" isVisible={!loading} appear={false} withMount={false}>
            {endIcon}
          </Transition>
        )}
      </>
    )
  }, [endIcon, loading])

  return (
    <div className={buildedClassname} {...dataProps}>
      <input
        // autoFocus={autoFocus}

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
        disabled={isInputDisabled}
        maxLength={maxLength}
        aria-label={ariaLabel || labelText}
        placeholder={placeholder}
      />
      <div class="input-border" />
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
