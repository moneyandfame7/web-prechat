import {type FC} from 'preact/compat'

import {ListItem} from './ListItem'

import './RadioGroup.scss'

export interface RadioGroupItem {
  value: string
  title: string
  subtitle?: string
}
interface RadioGroupProps {
  values: RadioGroupItem[]
  onChange: (value: string) => void
  value: string
  disabled?: boolean
  loadingFor?: string
}
const RadioGroup: FC<RadioGroupProps> = ({values, onChange, value, disabled, loadingFor}) => (
  <div class="radio-group" value={'dark'}>
    {values.map((v) => (
      <ListItem
        disabled={disabled}
        key={v.value}
        onClick={() => {
          !loadingFor && onChange(v.value)
        }}
        title={v.title}
        subtitle={v.subtitle}
      >
        <label class={`input-radio-wrapper${loadingFor === v.value ? ' loading' : ''}`}>
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
