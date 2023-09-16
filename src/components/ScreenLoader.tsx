import {type FC, memo} from 'preact/compat'

import clsx from 'clsx'

import type {Size} from 'types/ui'

import {Spinner} from './ui'

import './ScreenLoader.scss'

interface ScreenLoaderProps {
  withBg?: boolean
  size?: Size
}
export const ScreenLoader: FC<ScreenLoaderProps> = memo(({withBg = true, size = 'large'}) => {
  return (
    <div
      class={clsx('screen-loader', {
        'with-bg': withBg,
      })}
    >
      <Spinner size={size} color="primary" />
    </div>
  )
})
