import { type VNode } from 'preact'
import { type FC } from 'preact/compat'

import type { SignalOrString } from 'types/ui'

import { Button, type ButtonProps } from './Button'

interface FloatButtonProps extends ButtonProps {
  icon: VNode
  'aria-label': SignalOrString
}
export const FloatButton: FC<FloatButtonProps> = ({ icon, children, ...props }) => {
  return (
    <Button className="Button-fab" {...props}>
      {icon}
      {children}
    </Button>
  )
}
