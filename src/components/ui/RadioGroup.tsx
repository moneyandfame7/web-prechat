import {type ChangeEvent, type FC, type TargetedEvent, useCallback} from 'preact/compat'

import {ListItem} from './ListItem'

import './RadioGroup.scss'

interface RadioGroupProps {
  values: {value: string; label: string; subtitle?: string}[]
  onChange: (value: string) => void
  value: string
}
const RadioGroup: FC<RadioGroupProps> = ({values, onChange, value}) => {
  return (
    <div class="radio-group" value={'dark'}>
      {values.map((v) => (
        <ListItem
          onClick={() => onChange(v.value)}
          key={v.label}
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
}

export {RadioGroup}
