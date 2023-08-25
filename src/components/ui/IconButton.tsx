import type {FC, TargetedEvent} from 'preact/compat'

import {logDebugWarn} from 'lib/logger'

import {IS_SENSOR} from 'common/config'

import {Ripple} from '../Ripple'
import type {ButtonProps} from './Button'
import {Icon, type IconName} from './Icon'

import './IconButton.scss'

interface IconButtonProps
  extends Pick<ButtonProps, 'className' | 'onClick' | 'ripple' | 'withFastClick'> {
  icon: IconName
}
export const IconButton: FC<IconButtonProps> = ({
  icon,
  className,
  onClick,
  withFastClick,
  ripple = true,
  ...props
}) => {
  const buildedClass = `IconButton  ${className || ''}`.trim()

  const handleMouseDown = (e: TargetedEvent<HTMLDivElement, MouseEvent>) => {
    e.preventDefault()
    if (e.button === 0) {
      logDebugWarn('[UI]: IconButton click')

      onClick?.()
    }
  }

  return (
    <div
      class={buildedClass}
      onMouseDown={withFastClick && !IS_SENSOR ? handleMouseDown : undefined}
      onClick={IS_SENSOR || !withFastClick ? onClick : undefined}
      {...props}
    >
      <Icon name={icon} color="secondary" />
      {ripple && <Ripple />}
    </div>
  )
}
