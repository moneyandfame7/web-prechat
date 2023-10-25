import {useSignal} from '@preact/signals'
import type {FC, RefObject, TargetedEvent} from 'preact/compat'

import {TEST_translate} from 'lib/i18n'

import {formatPhone} from 'utilities/phone/formatPhone'

import type {SignalOr} from 'types/ui'

import {InputText} from 'components/ui'

import './PhoneNumberInput.scss'

interface PhoneNumberInputProps {
  onInput: (phone: string) => void
  value: SignalOr<string>
  elRef: RefObject<HTMLInputElement>
  autoFocus?: boolean
}
const validKeys = ['ArrowLeft', 'ArrowRight', 'Tab', 'Delete', 'Backspace', 'Enter']
export const PhoneNumberInput: FC<PhoneNumberInputProps> = ({
  elRef,
  onInput,
  value,
  autoFocus = true,
}) => {
  const pattern = useSignal('')
  const handleOnInput = (e: TargetedEvent<HTMLInputElement, Event>) => {
    const formatted = formatPhone(e.currentTarget.value.replace(/\s/g, ''))

    if (formatted.formatted.trim() !== e.currentTarget.value) {
      e.currentTarget.value = formatted.formatted.trim()
    }
    // check other numbers, prevent to paste letters and other symbols, check keyboard on mobile phone.
    // also create handler for OTP Code
    pattern.value = formatted.remainingPattern || ''
    onInput(formatted.formatted)
  }

  const handleOnKeydown = (e: TargetedEvent<HTMLInputElement, KeyboardEvent>) => {
    if (!/[+\d]/.test(e.key) && !validKeys.includes(e.key) && !e.metaKey) {
      e.preventDefault()
    }
  }

  return (
    <InputText
      id="phone-input"
      className="PhoneNumberInput"
      autoFocus={autoFocus}
      elRef={elRef}
      label={TEST_translate('PhoneNumber')}
      inputMode="tel"
      autoCorrect="off"
      autoComplete="tel"
      type="tel"
      value={value}
      onInput={handleOnInput}
      onKeyDown={handleOnKeydown}
      children={
        <span data-pattern={pattern} class="input-value">
          {value}
        </span>
      }
    />
  )
}
