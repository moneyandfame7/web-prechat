import {type ChangeEvent, type FC, type TargetedEvent, useCallback} from 'preact/compat'

import {ListItem} from './ListItem'

import './RadioGroup.scss'

interface RadioGroupProps {
  values: {value: string; label: string; subtitle?: string}[]
  onChange: (value: string) => void
  value: string
  disabled?: boolean
}
const RadioGroup: FC<RadioGroupProps> = ({values, onChange, value, disabled}) => (
  <div class="radio-group" value={'dark'}>
    {values.map((v) => (
      <ListItem
        disabled={disabled}
        key={v.label}
        onClick={() => onChange(v.value)}
        title={v.label}
        subtitle={v.subtitle}
      >
        <label class="input-radio-wrapper">
          <input
            class="input-radio"
            checked={value === v.value}
            // value={v.value}
            type="radio"
            // onChange={handleChange}
          />
          <span class="radio-btn" />
        </label>
      </ListItem>
    ))}
  </div>
)

export {RadioGroup}
