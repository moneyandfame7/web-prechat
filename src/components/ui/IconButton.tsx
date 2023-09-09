import type {FC, TargetedEvent} from 'preact/compat'

import clsx from 'clsx'

import {logDebugWarn} from 'lib/logger'

import {IS_SENSOR} from 'common/config'

import {Ripple} from '../Ripple'
import type {ButtonProps} from './Button'
import {Icon, type IconName} from './Icon'

import './IconButton.scss'

/**
 * використовувати кнопку замість діва?
 */
export interface IconButtonProps
  extends Pick<
    ButtonProps,
    'className' | 'onClick' | 'ripple' | 'withFastClick' | 'variant' | 'color' | 'isDisabled'
  > {
  icon: IconName
}
export const IconButton: FC<IconButtonProps> = ({
  icon,
  className,
  onClick,
  withFastClick = true,
  ripple = true,
  color = 'gray',
  variant = 'transparent',
  isDisabled,
  ...props
}) => {
  const buildedClass = clsx(`IconButton Button-${color} Button-${variant}`, className, {
    disabled: isDisabled,
  })

  const handleMouseDown = (e: TargetedEvent<HTMLDivElement, MouseEvent>) => {
    e.preventDefault()
    if (e.button === 0) {
      onClick?.()
    }
  }

  return (
    <div
      class={buildedClass}
      onMouseDown={withFastClick && !IS_SENSOR ? handleMouseDown : undefined}
      onClick={IS_SENSOR || !withFastClick ? onClick : undefined}
      disabled={isDisabled}
      {...props}
    >
      <Icon name={icon} color="secondary" />
      {ripple && <Ripple />}
    </div>
  )
}
