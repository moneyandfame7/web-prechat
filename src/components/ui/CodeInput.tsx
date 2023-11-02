import {type FC, type RefObject, type TargetedEvent, useRef} from 'preact/compat'

import {TEST_translate} from 'lib/i18n'

import type {SignalOr} from 'types/ui'

import {InputText} from './Input'

interface CodeInputProps {
  elRef?: RefObject<HTMLInputElement>
  error?: SignalOr<string>
  label?: SignalOr<string>
  value: SignalOr<string>
  isLoading?: boolean
  autoFocus?: boolean
  onInput: (value: string) => void
  cb?: (code: string) => void
}
const CODE_LENGTH = 6

export const CodeInput: FC<CodeInputProps> = ({
  elRef,
  error,
  // label,
  isLoading,
  autoFocus,
  value,
  onInput,
  cb,
}) => {
  let inputRef = useRef<HTMLInputElement>(null)
  if (elRef) {
    inputRef = elRef
  }
  const handleOnInput = (e: TargetedEvent<HTMLInputElement, Event>) => {
    e.preventDefault()

    const {value} = e.currentTarget
    // setCode(value)

    const newValue = value.substring(0, CODE_LENGTH).replace(/[^\d]/g, '')
    if (newValue !== e.currentTarget.value) {
      e.currentTarget.value = newValue
    }
    onInput(newValue)
    if (value.length === CODE_LENGTH) {
      // elRef.current?.blur() // @commented to avoid flick monkey
      cb?.(value)
    }
  }
  return (
    <InputText
      pattern="[0-9]*"
      inputMode="tel"
      type="tel"
      elRef={inputRef}
      autoFocus={autoFocus}
      error={error}
      maxLength={CODE_LENGTH}
      label={TEST_translate('Code')}
      value={value}
      loading={isLoading}
      onInput={handleOnInput}
    />
  )
}
