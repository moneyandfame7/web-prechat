import type {FC, TargetedEvent} from 'preact/compat'

import clsx from 'clsx'

import {useFastClick} from 'hooks/useFastClick'

import type {SignalOr} from 'types/ui'

import {Transition} from 'components/transitions'

import {Ripple} from '../Ripple'
import type {ButtonProps} from './Button'
import {Icon, type IconColor, type IconName} from './Icon'

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
  iconColor?: IconColor
  withIconAnimation?: boolean
  animation?: 'rotate' | 'zoomIcon'
  animationTimeout?: number
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
  withIconAnimation = false,
  animation,
  animationTimeout,
  ...props
}) => {
  const buildedClass = clsx(
    `IconButton IconButton-${icon} Button-${color} Button-${variant}`,
    className,
    {
      'without-animate': !withIconAnimation && !animation,
    }
  )

  const shouldAnimate = withIconAnimation || !!animation || !!animationTimeout

  const clickHandlers = useFastClick(onClick, withFastClick)

  return (
    <button id={id} class={buildedClass} {...clickHandlers} disabled={isDisabled} {...props}>
      {shouldAnimate ? (
        <Transition timeout={animationTimeout} activeKey={icon} name={animation || 'zoomIcon'}>
          <Icon name={icon} color={iconColor} />
        </Transition>
      ) : (
        <Icon name={icon} color={iconColor} />
      )}
      {ripple && <Ripple />}
    </button>
  )
}
