import {
  type ChangeEvent,
  type FC,
  type TargetedEvent,
  useCallback,
  useEffect,
} from 'preact/compat'

import {useFastClick} from 'hooks/useFastClick'

import type {SignalOr, Size} from 'types/ui'

import './SwitchInput.scss'

interface SwitchInputProps {
  checked: SignalOr<boolean>
  onChange?: (checked: boolean) => void
  size?: Size
}
const SwitchInput: FC<SwitchInputProps> = ({checked, onChange, size = 'small'}) => {
  const handleChange = useCallback(
    (e: TargetedEvent<HTMLInputElement, ChangeEvent>) => {
      console.log('SWITCH', checked, e.currentTarget.checked)

      onChange?.(e.currentTarget.checked)
    },
    [checked]
  )
  useEffect(() => {
    console.log({checked})
  }, [])
  // const clickHandlers = useFastClick(handleChange, true)
  return (
    <div class={`switch-input-wrapper ${size}`}>
      <input
        class="switch-input"
        id="switch"
        type="checkbox"
        checked={checked}
        onChange={handleChange}
        // onChange={handleChange}
        // {...clickHandlers}
      />
      <label class="switch-input-label" for="switch" />
    </div>
  )
}

export {SwitchInput}
