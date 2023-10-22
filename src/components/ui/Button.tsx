import type {FC, TargetedEvent} from 'preact/compat'

import clsx from 'clsx'

import {useFastClick} from 'hooks/useFastClick'

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
  shape?: 'rounded' | 'default'
  variant?: 'contained' | 'transparent'
  color?: 'primary' | 'red' | 'green' | 'gray'
  withFastClick?: boolean
  ripple?: boolean
  onClick?: (e?: TargetedEvent<HTMLButtonElement, MouseEvent>) => void
  id?: SignalOr<string>
  className?: string
  fullWidth?: boolean
  'aria-label'?: SignalOrString
  uppercase?: boolean
  icon?: IconName
  rounded?: boolean
  /**
   * @default "end"
   */
  iconPosition?: 'start' | 'end'
  contentPosition?: 'start' | 'center' | 'end'
  bold?: boolean
}

export const Button: FC<ButtonProps> = ({
  isLoading = false,
  loadingText = 'Please wait...',
  type = 'button',
  icon,
  isDisabled = false,
  variant = 'contained',
  shape = 'default',
  children,
  ripple = true,
  fullWidth = true,
  onClick,
  className,
  color = 'primary',
  withFastClick = color !== 'red',
  uppercase = true,
  'aria-label': ariaLabel,
  iconPosition = 'end',
  bold = true,
  contentPosition = 'center',
}) => {
  const buildClass = clsx(
    'Button',
    `Button-${variant}`,
    `Button-${color}`,
    `content-${contentPosition}`,

    {
      'Button-loading': isLoading,
      'Button-fullwidth': fullWidth,
      'Button-noTransform': !uppercase,
      'Button-rounded': shape === 'rounded',
      'no-bold': !bold,
    },
    className
  )

  const clickHandlers = useFastClick(onClick, withFastClick)

  return (
    <button
      aria-label={ariaLabel}
      type={type}
      disabled={isLoading || isDisabled}
      class={buildClass}
      {...clickHandlers}
    >
      {!isLoading && icon && iconPosition === 'start' && <Icon name={icon} />}

      {!isLoading && children}
      {!isLoading && icon && iconPosition === 'end' && <Icon name={icon} />}

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
