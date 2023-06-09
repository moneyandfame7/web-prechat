import { FC } from 'preact/compat'

import clsx from 'clsx'

import './Button.scss'

interface ButtonProps {
  isLoading?: boolean
  loadingText?: string
  isDisabled?: boolean
  variant?: 'contained' | 'transparent'
}
export const Button: FC<ButtonProps> = ({
  isLoading = false,
  // loadingText,
  isDisabled = false,
  // variant = 'contained',
  children
}) => {
  const buildClass = clsx('button', {
    'loading': isLoading,
    'disabled': isDisabled
  })
  return <button class={buildClass}>{children}</button>
}
