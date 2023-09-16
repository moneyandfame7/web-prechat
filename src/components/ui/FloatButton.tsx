import {type VNode} from 'preact'
import {type FC} from 'preact/compat'

import clsx from 'clsx'

import type {SignalOrString} from 'types/ui'

import {Button, type ButtonProps} from './Button'

import './FloatButton.scss'

interface FloatButtonProps {
  icon: VNode
  'aria-label': SignalOrString
  shown: boolean
}
export const FloatButton: FC<FloatButtonProps & Omit<ButtonProps, 'icon'>> = ({
  icon,
  children,
  className,
  shown,
  ...props
}) => {
  const buildedClass = clsx('FloatButton', className, {
    shown,
  })

  return (
    <Button className={buildedClass} loadingText="" {...props}>
      {icon}
      {children}
    </Button>
  )
}
