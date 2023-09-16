import type {FC, TargetedEvent} from 'preact/compat'

import clsx from 'clsx'

import {useFastClick} from 'hooks/useFastClick'

import {IS_SENSOR} from 'common/config'

import {SignalOr} from 'types/ui'

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
  onClick?: (e: TargetedEvent<HTMLDivElement, MouseEvent>) => void
  title?: SignalOr<string>
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
  ...props
}) => {
  const buildedClass = clsx(`IconButton Button-${color} Button-${variant}`, className, {
    disabled: isDisabled,
  })

  const clickHandlers = useFastClick({fast: withFastClick, handler: onClick})

  return (
    <div id={id} class={buildedClass} {...clickHandlers} disabled={isDisabled} {...props}>
      <Icon name={icon} color="secondary" />
      {ripple && <Ripple />}
    </div>
  )
}
