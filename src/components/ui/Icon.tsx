import {type FC, type JSX, type TargetedEvent, memo, useCallback} from 'preact/compat'

import * as icons from 'assets/icons/all'

import {logDebugWarn} from 'lib/logger'

import {IS_SENSOR} from 'common/environment'

import './Icon.scss'

type SVGIconProps = JSX.SVGAttributes<SVGSVGElement>

export type IconName = keyof typeof icons
export type IconColor = 'default' | 'secondary' | 'primary' | 'white'
interface IconProps {
  name: IconName
  className?: string
  color?: IconColor
  title?: string
  onClick?: (e: TargetedEvent<SVGSVGElement, MouseEvent>) => void
  withFastClick?: boolean
  /**
   * @default 24
   */
  height?: number
  /**
   * @default 24
   */
  width?: number
}
export const Icon: FC<IconProps> = memo(
  ({name, className, color = 'default', onClick, withFastClick = false, title, ...props}) => {
    const ComputedIcon = icons[name] as FC<SVGIconProps>

    const buildedClass = `Icon Icon-${name} Icon-${color} ${className || ''}`.trim()

    const handleMouseDown = useCallback(
      (e: TargetedEvent<SVGSVGElement, MouseEvent>) => {
        e.preventDefault()

        if (e.button === 0) {
          logDebugWarn('[UI]: Button click')

          onClick?.(e)
        }
      },
      [onClick]
    )

    return (
      <ComputedIcon
        title={title}
        className={buildedClass}
        onMouseDown={withFastClick && !IS_SENSOR ? handleMouseDown : undefined}
        onClick={IS_SENSOR || !withFastClick ? onClick : undefined}
        {...props}
      />
    )
  }
)
