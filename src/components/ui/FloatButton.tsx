import {type VNode} from 'preact'
import {type FC} from 'preact/compat'
import clsx from 'clsx'

import type {SignalOrString} from 'types/ui'

import {Button, type ButtonProps} from './Button'

import './FloatButton.scss'

interface FloatButtonProps extends ButtonProps {
  icon: VNode
  'aria-label': SignalOrString
}
export const FloatButton: FC<FloatButtonProps> = ({
  icon,
  children,
  className,
  ...props
}) => {
  const buildedClass = clsx('FloatButton', className)

  return (
    <Button className={buildedClass} {...props}>
      {icon}
      {children}
    </Button>
  )
}
