import {type CSSProperties, type FC} from 'preact/compat'

import clsx from 'clsx'

import type {Size} from 'types/ui'

import {SingleTransition} from 'components/transitions'

import {Icon} from '.'

import './Loader.scss'

interface LoaderProps {
  isVisible?: boolean
  isCancelable?: boolean
  isUpload?: boolean
  isLoading?: boolean
  isPending?: boolean
  styles?: CSSProperties
  size?: Size
  withBackground?: boolean
}

const Loader: FC<LoaderProps> = ({
  isCancelable = false,
  isVisible,
  isLoading = true,
  isPending = false,
  styles,
  size = 'medium',
  withBackground = true,
}) => {
  const buildedClass = clsx(`loader-container ${size}`, {
    loading: isLoading && !isPending,
    cancelable: isCancelable,
    pending: isPending,
    'with-bg': withBackground,
  })
  return (
    <SingleTransition
      in={isVisible}
      unmount
      className={buildedClass}
      name="zoomFade"
      easing="ease-in-out"
      timeout={150}
      styles={{...styles}}
    >
      {/* <div class={buildedClass}> */}
      <Icon name="download" className="loader-download" />
      <Icon name="close" className="loader-cancel" />
      <span class="loader-circular" />
      {/* </div> */}
    </SingleTransition>
  )
}

export {Loader}
