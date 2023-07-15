import { FC, JSX, Suspense, TargetedEvent, memo, useCallback } from 'preact/compat'

import * as icons from 'assets/icons/all'
import { logDebugWarn } from 'lib/logger'
import { IS_SENSOR } from 'common/config'
type SVGIconProps = JSX.SVGAttributes<SVGSVGElement>

export type IconName = keyof typeof icons

interface IconProps {
  name: IconName
  className?: string
  color?: 'default' | 'secondary'
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
  ({ name, className, color = 'default', onClick, withFastClick = false, ...props }) => {
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
      <Suspense fallback="...">
        <ComputedIcon
          class={buildedClass}
          onMouseDown={withFastClick && !IS_SENSOR ? handleMouseDown : undefined}
          onClick={IS_SENSOR || !withFastClick ? onClick : undefined}
          {...props}
        />
      </Suspense>
    )
  }
)
