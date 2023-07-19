import type { FC, RefObject, TargetedEvent} from 'preact/compat';
import { useCallback } from 'preact/compat'

import { InputText } from 'components/ui'
import { t } from 'lib/i18n'

import './PhoneNumberInput.scss'

interface PhoneNumberInputProps {
  onInput: (phone: string) => void
  value: string
  elRef: RefObject<HTMLInputElement>
  autoFocus?: boolean
  remainingPattern?: string
}

export const PhoneNumberInput: FC<PhoneNumberInputProps> = ({
  elRef,
  onInput,
  value,
  autoFocus = true,
  remainingPattern
}) => {
  const handleKeydown = useCallback((e: TargetedEvent<HTMLInputElement, KeyboardEvent>) => {
    if (e.key === ' ') {
      e.preventDefault()
    }
  }, [])
  const handleInput = useCallback(
    (e: TargetedEvent<HTMLInputElement, Event>) => {
      const { value } = e.currentTarget

      onInput(value)
    },
    [onInput]
  )

  return (
    <InputText
      id="phone-input"
      className="PhoneNumberInput"
      autoFocus={autoFocus}
      elRef={elRef}
      label={t('PhoneNumber')}
      value={value}
      onInput={handleInput}
      onKeyDown={handleKeydown}
      children={
        <div data-remaining-pattern={remainingPattern} class="input-value">
          {value}
        </div>
      }
    />
  )
}
