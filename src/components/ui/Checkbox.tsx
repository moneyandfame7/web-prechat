import type {Signal} from '@preact/signals'
import {type FC, type TargetedEvent, useCallback} from 'preact/compat'

import clsx from 'clsx'

import {getSignalOr} from 'utilities/getSignalOr'
import {stopEvent} from 'utilities/stopEvent'

import type {PreactNode, SignalOr} from 'types/ui'

import {Ripple} from '../Ripple'
import {Icon} from './Icon'

import './Checkbox.scss'

interface CheckboxProps {
  id?: string
  label?: PreactNode
  subtitle?: PreactNode
  onToggle?: (checked: boolean) => void
  checked?: SignalOr<boolean>
  withRipple?: boolean
  disabled?: SignalOr<boolean>
  className?: string
  fullWidth?: boolean
}

export const Checkbox: FC<CheckboxProps> = ({
  label,
  onToggle,
  checked,
  withRipple = true,
  disabled,
  id,
  className,
  fullWidth = true,
  subtitle,
}) => {
  const handleChange = (e: TargetedEvent<HTMLInputElement, Event>) => {
    console.log('HANDLE CHANGE?')
    e.stopImmediatePropagation()
    onToggle?.(e.currentTarget.checked)
  }

  const buildedClass = clsx('Checkbox', className, {
    disabled,
    ripple: withRipple,
    'full-width': fullWidth,
  })
  /* подумати потім, як переробити щоб працювали signals */
  // https://codepen.io/bradyhullopeter/pen/bGrjzJy

  return (
    <label
      htmlFor={id}
      class={buildedClass}
      // onClick={(e) => {
      //   onToggle?.(!getSignalOr(checked))
      //   console.log(e.target, 'target')
      //   stopEvent(e)
      // }}
    >
      <div class="Checkbox-wrapper">
        <input id={id} type="checkbox" onChange={handleChange} checked={checked} />
        {/* <Transition
        appear={false}
        withMount={false}
        type="zoomFade"
        isVisible={checked instanceof Signal ? checked.value : checked}
      > */}
        <Icon name="check" width={15} height={15} color="white" />
      </div>
      {label && <p class="label">{label}</p>}
      {subtitle && <span class="subtitle">{subtitle}</span>}

      {/* </Transition> */}
      {withRipple && <Ripple />}
    </label>
  )
}
