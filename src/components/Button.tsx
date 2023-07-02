import { FC, TargetedEvent } from 'preact/compat'
import clsx from 'clsx'

import { IS_SENSOR } from 'common/config'
import { logDebugWarn } from 'lib/logger'

import { Ripple } from './Ripple'
import { Spinner } from './Spinner'

import './Button.scss'

interface ButtonProps {
  isLoading?: boolean
  loadingText?: string
  isDisabled?: boolean
  type?: 'button' | 'submit'
  variant?: 'contained' | 'transparent'
  withFastClick?: boolean
  ripple?: boolean
  onClick?: () => void
}

export const Button: FC<ButtonProps> = ({
  isLoading = false,
  loadingText,
  type = 'button',
  isDisabled = false,
  variant = 'contained',
  children,
  withFastClick = true,
  ripple = true,
  onClick
}) => {
  const buildClass = clsx('Button', `Button-${variant}`, {
    'Button-loading': isLoading,
    'Button-disabled': isDisabled
  })

  const handleMouseDown = (e: TargetedEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault()
    if (e.button === 0) {
      logDebugWarn('[UI]: Button click')

      onClick?.()
    }
  }

  return (
    <button
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
            <Spinner color="white" size="small" />
          </span>
        </>
      )}
      {!isLoading && ripple && <Ripple />}
    </button>
  )
}
