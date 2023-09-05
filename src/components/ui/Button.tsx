import type {FC, TargetedEvent} from 'preact/compat'

import clsx from 'clsx'

import {IS_SENSOR} from 'common/config'

import type {SignalOr, SignalOrString} from 'types/ui'

import {Ripple} from '../Ripple'
import {Icon, type IconName} from './Icon'
import {Spinner} from './Spinner'

import './Button.scss'

export interface ButtonProps {
  isLoading?: boolean
  loadingText?: string
  isDisabled?: SignalOr<boolean | undefined>
  type?: 'button' | 'submit'
  variant?: 'contained' | 'transparent'
  color?: 'primary' | 'red' | 'green' | 'gray'
  withFastClick?: boolean
  ripple?: boolean
  onClick?: () => void
  className?: string
  fullWidth?: boolean
  'aria-label'?: SignalOrString
  uppercase?: boolean
  icon?: IconName
  rounded?: boolean
}

export const Button: FC<ButtonProps> = ({
  isLoading = false,
  loadingText = 'Please wait...',
  type = 'button',
  icon,
  isDisabled = false,
  variant = 'contained',
  children,
  ripple = true,
  fullWidth = true,
  onClick,
  className,
  color = 'primary',
  withFastClick = color !== 'red',
  uppercase = true,
  'aria-label': ariaLabel,
}) => {
  const buildClass = clsx(
    'Button',
    `Button-${variant}`,
    `Button-${color}`,
    {
      'Button-loading': isLoading,
      'Button-fullwidth': fullWidth,
      'Button-noTransform': !uppercase,
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
      {!isLoading && icon && <Icon name={icon} />}
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
