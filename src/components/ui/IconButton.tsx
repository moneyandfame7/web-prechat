import type {FC, TargetedEvent} from 'preact/compat'

import clsx from 'clsx'

import {useFastClick} from 'hooks/useFastClick'

import type {SignalOr} from 'types/ui'

import {Ripple} from '../Ripple'
import type {ButtonProps} from './Button'
import {Icon, type IconName} from './Icon'

import './IconButton.scss'

/**
 * використовувати кнопку замість діва?
 */
interface PickedButtonProps
  extends Pick<
    ButtonProps,
    'className' | 'ripple' | 'withFastClick' | 'variant' | 'color' | 'isDisabled' | 'id'
  > {}
export interface IconButtonProps {
  icon: IconName
  onClick?: (e: TargetedEvent<HTMLButtonElement, MouseEvent>) => void
  title?: SignalOr<string>
  iconColor?: 'default' | 'secondary' | 'primary'
}

export const IconButton: FC<IconButtonProps & PickedButtonProps> = ({
  icon,
  className,
  onClick,
  withFastClick = true,
  ripple = true,
  color = 'gray',
  variant = 'transparent',
  isDisabled,
  id,
  iconColor = 'secondary',
  ...props
}) => {
  const buildedClass = clsx(`IconButton Button-${color} Button-${variant}`, className)

  const clickHandlers = useFastClick(onClick, withFastClick)

  return (
    <button id={id} class={buildedClass} {...clickHandlers} disabled={isDisabled} {...props}>
      <Icon name={icon} color={iconColor} />
      {ripple && <Ripple />}
    </button>
  )
}
