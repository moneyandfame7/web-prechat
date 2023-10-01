import {type FC, memo} from 'preact/compat'

import clsx from 'clsx'

import type {Size} from 'types/ui'

import {Spinner} from './ui'
import type {SpinnerColor} from './ui/Spinner'

import './ScreenLoader.scss'

interface ScreenLoaderProps {
  withBg?: boolean
  size?: Size
  color?: SpinnerColor
  zoom?: boolean
}
export const ScreenLoader: FC<ScreenLoaderProps> = memo(
  ({withBg = true, size = 'large', color}) => {
    return (
      <div
        class={clsx('screen-loader', {
          'with-bg': withBg,
        })}
      >
        <Spinner size={size} color={color} />
      </div>
    )
  }
)
