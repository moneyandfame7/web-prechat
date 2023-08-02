import type {FC, TargetedEvent} from 'preact/compat'
import clsx from 'clsx'

import {IS_SENSOR} from 'common/config'

import type {SignalOr, SignalOrString} from 'types/ui'

import {Spinner} from './Spinner'
import {Ripple} from '../Ripple'

import './Button.scss'

export interface ButtonProps {
  isLoading?: boolean
  loadingText?: string
  isDisabled?: SignalOr<boolean | undefined>
  type?: 'button' | 'submit'
  variant?: 'contained' | 'transparent'
  withFastClick?: boolean
  ripple?: boolean
  onClick?: () => void
  className?: string
  'aria-label'?: SignalOrString
}

export const Button: FC<ButtonProps> = ({
  isLoading = false,
  loadingText = 'Please wait...',
  type = 'button',
  isDisabled = false,
  variant = 'contained',
  children,
  withFastClick = true,
  ripple = true,
  onClick,
  className,
  'aria-label': ariaLabel
}) => {
  const buildClass = clsx(
    'Button',
    `Button-${variant}`,
    {
      'Button-loading': isLoading
    },
    className
  )

  const handleMouseDown = (e: TargetedEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault()
    if (e.button === 0) {
      // logDebugWarn('[UI]: Button click')

      onClick?.()
    }
  }
  return (
    <button
      aria-label={ariaLabel}
      type={type}
      disabled={isLoading || isDisabled}
      class={buildClass}
      onMouseDown={withFastClick && !IS_SENSOR ? handleMouseDown : undefined}
      onClick={IS_SENSOR || !withFastClick ? onClick : undefined}
    >
      {!isLoading && children}
      {isLoading && (
        <>
          {loadingText}
          <span class="loader">
            <Spinner color={variant === 'contained' ? 'white' : 'primary'} size="small" />
          </span>
        </>
      )}
      {!isLoading && ripple && <Ripple />}
    </button>
  )
}
