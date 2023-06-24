import { FC, TargetedEvent } from 'preact/compat'
import clsx from 'clsx'

import { IS_SENSOR } from 'common/config'

import { Spinner } from './Spinner'
import './Button.scss'

interface ButtonProps {
  isLoading?: boolean
  loadingText?: string
  isDisabled?: boolean
  type?: 'button' | 'submit'
  variant?: 'contained' | 'transparent'
  withFastClick?: boolean
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
  onClick
}) => {
  const buildClass = clsx('Button', `Button-${variant}`, {
    'Button-loading': isLoading,
    'Button-disabled': isDisabled
  })
  const handleMouseDown = (e: TargetedEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault()
    if (e.button === 0) {
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
      {isLoading ? loadingText : children}
      {isLoading && !loadingText && (
        <span class="loader">
          <Spinner color="white" size="small" />
        </span>
      )}
    </button>
  )
}
